echo "=== Package Information ==="
read -p "Enter Package Name: " PK_NAME
read -p "Enter Domain Name : " PK_DOMAIN

echo
echo "=== Admin Information ==="
read -p "Enter Admin Name: " ADMIN_NAME
read -p "Enter Admin Email: " ADMIN_EMAIL
read -p "Enter Admin Password: " ADMIN_PASSWORD
read -p "Enter Admin Phone: " ADMIN_PHONE

echo
echo "=== Store Information ==="
read -p "Enter Store Name: " STORE_NAME
read -p "Enter Store Description: " STORE_DESCRIPTION
read -p "Enter Store Email: " STORE_EMAIL
read -p "Enter Store Phone: " STORE_PHONE

echo
echo "=== Store Location ==="
read -p "Enter Postcode: " POSTCODE
read -p "Enter City: " CITY
read -p "Enter State (default IN-MH): " STATE
STATE=${STATE:-IN-MH}
read -p "Enter Country (default IN): " COUNTRY
COUNTRY=${COUNTRY:-IN}
read -p "Enter Address: " ADDRESS

ADDRESS_UUID=""
ADMIN_UUID=""
STORE_UUID=""

echo
echo "=== Mail Configuration ==="
read -p "Enter Mail Service: " MAIL_SERVICE
read -p "Enter Mail From: " MAIL_FROM
read -p "Enter Mail Password: " MAIL_PASSWORD

echo "===== Summary ====="
echo "Package Name     : $PK_NAME"
echo "Admin Name       : $ADMIN_NAME"
echo "Admin Email      : $ADMIN_EMAIL"
echo "Admin Phone      : $ADMIN_PHONE"
echo "Admin Password   : $ADMIN_PASSWORD"
echo "Store Name       : $STORE_NAME"
echo "Store Description: $STORE_DESCRIPTION"
echo "Store Email      : $STORE_EMAIL"
echo "Store Phone      : $STORE_PHONE"
echo "Postcode         : $POSTCODE"
echo "City             : $CITY"
echo "State            : $STATE"
echo "Country          : $COUNTRY"
echo "Address          : $ADDRESS"
echo "Mail Service     : $MAIL_SERVICE"
echo "Mail From        : $MAIL_FROM"
echo "Mail Password    : $MAIL_PASSWORD"
echo
read -p "Do you want to continue? (y/n): " CONTINUE
if [ "$CONTINUE" != "y" ]; then
    exit 1
fi

echo "[*] Updating System & istalling dependencies"
sudo apt update
sudo apt install -y nodejs npm
sudo npm install -g pm2
echo "[+] System Updated & node installed"

echo "export PK_NAME=$PK_NAME" >> ~/.bashrc
echo "export PK_DOMAIN=$PK_DOMAIN" >> ~/.bashrc

# Install & Setup Postgres
echo "[*] Installing Postgresql [installing]"
sudo apt install -y postgresql
echo "[*] Installing Postgresql [setup]"
sudo sed -i "s/#listen_addresses = 'localhost'/listen_addresses = 'localhost'/g" /etc/postgresql/*/main/postgresql.conf
sudo sed -ri  "s/(^ssl.*)/#\1/g" /etc/postgresql/*/main/postgresql.conf
sudo -u postgres createdb $PK_NAME
sudo -u postgres psql $PK_NAME -c "ALTER USER postgres with encrypted password 'password1';"
sudo sed -ri "s/(local\s*all\s*postgres\s*)peer/\1scram-sha-256/g" /etc/postgresql/*/main/pg_hba.conf
echo "[*] Installing Postgresql [restarting]"
sudo systemctl restart postgresql
echo "[+] Installed Postgresql"

# Download & Build Ecomshop
echo "[*] Settingup Ecomshop [downloading]"
cd ~
git clone https://github.com/iamabhi747/ecomshop
cd ecomshop
echo "[*] Settingup Ecomshop [installing dependencies]"
npm i
echo "[*] Settingup Ecomshop [building]"
npm run build

# Environment Variables
echo "[*] Settingup Ecomshop [enviroment variables]"
cd ~/ecomshop
echo "
DB_HOST=\"localhost\"
DB_PORT=\"5432\"
DB_NAME=\"$PK_NAME\"
DB_USER=\"postgres\"
DB_PASSWORD=\"password1\"
DB_SSLMODE=\"disable\"

MAIL_PASSWORD=\"$MAIL_PASSWORD\"
" > .env
echo "[+] Ecomshop setup completed"

# PM2 start & stop for database creation
echo "[*] Starting Ecomshop to build database"
pm2 start npm --name $PK_NAME -- start
echo "[+] Ecomshop started"
sleep 10
echo "[*] Stoping Ecomshop"
pm2 stop $PK_NAME

# Super Store & Admin Creation
echo "[*] Database Setup"
cd ~/ecomshop
PGPASSWORD=password1 psql -h localhost -U postgres -d $PK_NAME -c "INSERT INTO cart_address (full_name, postcode, telephone, country, province, city, address_1)
VALUES ('$STORE_NAME', '$POSTCODE', '$STORE_PHONE', '$COUNTRY', '$STATE', '$CITY', '$ADDRESS');"
ADDRESS_UUID=$(PGPASSWORD=password1 psql -h localhost -U postgres -d $PK_NAME -t -c "SELECT uuid FROM cart_address LIMIT 1" | sed "s/ //g")
PGPASSWORD=password1 psql -h localhost -U postgres -d $PK_NAME -c "INSERT INTO store_info (name, description, phone, email, address_uuid)
VALUES ('$STORE_NAME', '$STORE_DESCRIPTION', '$STORE_PHONE', '$STORE_EMAIL', '$ADDRESS_UUID');"
STORE_UUID=$(PGPASSWORD=password1 psql -h localhost -U postgres -d $PK_NAME -t -c "SELECT uuid FROM store_info LIMIT 1" | sed "s/ //g")
ADMIN_PASSWORD_HASH=$(node -e "const{hashPassword}=require('@evershop/evershop/src/lib/util/passwordHelper');console.log(hashPassword('$ADMIN_PASSWORD'));")
PGPASSWORD=password1 psql -h localhost -U postgres -d $PK_NAME -c "INSERT INTO admin_user (email, password, full_name, store_uuid, phone)
VALUES ('$ADMIN_EMAIL', '$ADMIN_PASSWORD_HASH', '$ADMIN_NAME', '$STORE_UUID', '$ADMIN_PHONE');"
ADMIN_UUID=$(PGPASSWORD=password1 psql -h localhost -U postgres -d $PK_NAME -t -c "SELECT uuid FROM admin_user LIMIT 1" | sed "s/ //g")
echo "[+] Database Setup Completed"

# Ecomshop Config
echo "[*] Configuring Ecomshop"
cd ~/ecomshop
mkdir config
echo "
{
    \"admin_super_uuid\": \"$ADMIN_UUID\",
    \"store_super_uuid\": \"$STORE_UUID\",
    \"shop\": {
        \"currency\": \"INR\"
    },
    \"mail\": {
        \"service\": \"$MAIL_SERVICE\",
        \"from\": \"$MAIL_FROM\"
    }
}
" > config/production.json
echo "[+] Ecomshop Configured"

# Nginx Config
echo "[*] Installing Nginx"
sudo apt install -y nginx
echo "[*] Configuring Nginx"
sudo cp ~/ecomshop/nginx.conf /etc/nginx/sites-available/$PK_NAME.conf
sudo sed -i "s/DOMAIN_NAME/$PK_DOMAIN/g" /etc/nginx/sites-available/$PK_NAME.conf
sudo ln -s /etc/nginx/sites-available/$PK_NAME.conf /etc/nginx/sites-enabled/
sudo unlink /etc/nginx/sites-enabled/default
echo "[*] restarting Nginx"
sudo systemctl restart nginx
echo "[+] Nginx setup completed"
mkdir /etc/nginx/ssl
echo "[i] Please add ssl certificate to /etc/nginx/ssl/$PK_NAME.crt"
echo "[i] Please add ssl private key to /etc/nginx/ssl/$PK_NAME.key"

# PM2 start
echo "[*] Starting Ecomshop"
cd ~/ecomshop
pm2 stop $PK_NAME
pm2 start $PK_NAME
echo "[+] Ecomshop is live"