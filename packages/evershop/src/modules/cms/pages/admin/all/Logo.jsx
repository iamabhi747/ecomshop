import PropTypes from 'prop-types';
import React from 'react';
import './Logo.scss';

export default function Logo({ dashboardUrl }) {
  return (
    <div className="logo">
      <a href={dashboardUrl} className="flex items-end">
        <svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" fillRule="evenodd" strokeLinejoin="round" strokeMiterlimit="2" clipRule="evenodd" viewBox="0 0 587 150">
          <path fillRule="nonzero" d="M192.56 31.684h8.948l13.251 38.998 13.156-38.998h8.854V77.81h-5.934V50.587c0-.942.021-2.502.063-4.679.042-2.177.063-4.511.063-7.002L217.804 77.81h-6.185l-13.251-38.904v1.413c0 1.131.027 2.852.079 5.165.052 2.313.078 4.014.078 5.103V77.81h-5.965V31.684Zm46.928 0h7.285l13.25 22.168 13.251-22.168h7.316l-17.427 27.537V77.81h-6.248V59.221l-17.427-27.537Zm-44.25 59.159c.048-1.343.282-2.325.702-2.949.755-1.102 2.211-1.654 4.368-1.654.204 0 .414.006.63.018.215.012.461.03.737.054v2.949a29.312 29.312 0 0 0-.728-.045c-.15-.006-.291-.009-.423-.009-.983 0-1.57.254-1.762.764-.192.509-.287 1.807-.287 3.892h3.2v2.553h-3.236v16.612h-3.201V96.416h-2.678v-2.553h2.678v-3.02Zm7.67 2.93h3.074v3.326c.252-.647.869-1.435 1.852-2.364.983-.929 2.116-1.393 3.398-1.393.06 0 .162.006.306.018.144.012.389.036.737.072v3.416a4.72 4.72 0 0 0-.53-.072 6.728 6.728 0 0 0-.531-.018c-1.63 0-2.882.524-3.757 1.573a5.493 5.493 0 0 0-1.313 3.623v11.074h-3.236V93.773Zm18.349-.431c1.367 0 2.691.32 3.973.962 1.283.641 2.26 1.471 2.931 2.49.647.971 1.079 2.103 1.294 3.398.192.887.288 2.301.288 4.243H215.63c.06 1.953.521 3.52 1.384 4.701.863 1.181 2.2 1.771 4.009 1.771 1.69 0 3.039-.557 4.046-1.672a5.643 5.643 0 0 0 1.222-2.247h3.182c-.083.707-.362 1.495-.836 2.364-.473.869-1.003 1.579-1.591 2.13-.983.959-2.199 1.606-3.649 1.942-.779.192-1.66.288-2.643.288-2.397 0-4.429-.872-6.095-2.616-1.666-1.744-2.499-4.186-2.499-7.327 0-3.092.839-5.603 2.517-7.533 1.678-1.929 3.871-2.894 6.58-2.894Zm5.16 8.522c-.132-1.403-.437-2.523-.917-3.362-.887-1.558-2.367-2.338-4.441-2.338-1.486 0-2.732.537-3.739 1.61-1.007 1.072-1.54 2.436-1.6 4.09h10.697Zm13.477-8.522c1.366 0 2.691.32 3.973.962 1.283.641 2.259 1.471 2.931 2.49.647.971 1.078 2.103 1.294 3.398.192.887.288 2.301.288 4.243h-14.113c.059 1.953.521 3.52 1.384 4.701.863 1.181 2.199 1.771 4.009 1.771 1.69 0 3.039-.557 4.045-1.672a5.626 5.626 0 0 0 1.223-2.247h3.182c-.084.707-.362 1.495-.836 2.364-.473.869-1.004 1.579-1.591 2.13-.983.959-2.199 1.606-3.65 1.942-.779.192-1.66.288-2.643.288-2.397 0-4.428-.872-6.094-2.616-1.666-1.744-2.499-4.186-2.499-7.327 0-3.092.839-5.603 2.517-7.533 1.678-1.929 3.871-2.894 6.58-2.894Zm5.16 8.522c-.132-1.403-.438-2.523-.917-3.362-.887-1.558-2.367-2.338-4.441-2.338-1.486 0-2.733.537-3.739 1.61-1.007 1.072-1.541 2.436-1.601 4.09h10.698Zm5.548-15.246h3.236v26.411h-3.236V86.618Zm13.89 24.325c2.146 0 3.617-.812 4.414-2.436.797-1.624 1.196-3.431 1.196-5.421 0-1.798-.288-3.26-.863-4.387-.911-1.773-2.481-2.66-4.711-2.66-1.977 0-3.416.755-4.315 2.265-.899 1.51-1.348 3.332-1.348 5.465 0 2.05.449 3.758 1.348 5.124.899 1.367 2.326 2.05 4.279 2.05Zm.126-17.727c2.481 0 4.579.827 6.293 2.481 1.714 1.654 2.571 4.087 2.571 7.299 0 3.105-.756 5.67-2.266 7.695-1.51 2.026-3.853 3.039-7.029 3.039-2.649 0-4.753-.896-6.311-2.688-1.558-1.792-2.337-4.198-2.337-7.219 0-3.236.821-5.813 2.463-7.73 1.642-1.918 3.847-2.877 6.616-2.877Zm17.666.216c1.51 0 2.829.371 3.955 1.114.611.42 1.235 1.031 1.87 1.834v-2.427h2.984v17.511c0 2.445-.359 4.375-1.078 5.789-1.343 2.613-3.878 3.92-7.605 3.92-2.074 0-3.818-.465-5.232-1.394-1.414-.928-2.205-2.382-2.373-4.359h3.29c.156.863.467 1.528.935 1.995.731.719 1.882 1.079 3.452 1.079 2.481 0 4.105-.875 4.872-2.625.455-1.031.665-2.87.629-5.519-.647.982-1.426 1.714-2.337 2.193-.911.479-2.116.719-3.614.719-2.085 0-3.91-.74-5.474-2.22-1.564-1.48-2.346-3.929-2.346-7.344 0-3.225.788-5.742 2.364-7.551 1.576-1.81 3.479-2.715 5.708-2.715Zm5.825 9.888c0-2.385-.491-4.153-1.474-5.304-.983-1.15-2.236-1.726-3.758-1.726-2.277 0-3.835 1.067-4.674 3.201-.444 1.138-.665 2.63-.665 4.476 0 2.17.44 3.821 1.321 4.953.881 1.133 2.065 1.699 3.551 1.699 2.325 0 3.961-1.048 4.908-3.146.527-1.187.791-2.571.791-4.153Zm13.657 7.623c2.145 0 3.616-.812 4.413-2.436.797-1.624 1.196-3.431 1.196-5.421 0-1.798-.288-3.26-.863-4.387-.911-1.773-2.481-2.66-4.71-2.66-1.978 0-3.416.755-4.315 2.265-.899 1.51-1.349 3.332-1.349 5.465 0 2.05.45 3.758 1.349 5.124.899 1.367 2.325 2.05 4.279 2.05Zm.125-17.727c2.481 0 4.579.827 6.293 2.481 1.714 1.654 2.571 4.087 2.571 7.299 0 3.105-.755 5.67-2.265 7.695-1.511 2.026-3.854 3.039-7.03 3.039-2.649 0-4.752-.896-6.311-2.688-1.558-1.792-2.337-4.198-2.337-7.219 0-3.236.821-5.813 2.463-7.73 1.642-1.918 3.848-2.877 6.616-2.877Zm11.643 15.893h3.758v3.919h-3.758v-3.919Zm7.616-15.336h3.2v2.733c.767-.947 1.463-1.636 2.086-2.067 1.067-.732 2.277-1.097 3.632-1.097 1.534 0 2.768.377 3.703 1.133.528.431 1.007 1.066 1.438 1.905.72-1.031 1.565-1.795 2.535-2.292.971-.497 2.062-.746 3.273-.746 2.589 0 4.35.935 5.285 2.805.504 1.006.755 2.361.755 4.063v12.818h-3.362V99.652c0-1.282-.32-2.163-.961-2.643-.642-.479-1.424-.719-2.347-.719-1.27 0-2.364.426-3.281 1.277-.917.851-1.375 2.271-1.375 4.261v11.2h-3.29v-12.567c0-1.306-.156-2.259-.468-2.858-.491-.899-1.408-1.349-2.75-1.349-1.223 0-2.335.474-3.335 1.421-1.001.947-1.502 2.661-1.502 5.142v10.211h-3.236V93.773Zm36.849-.431c1.367 0 2.691.32 3.974.962 1.282.641 2.259 1.471 2.93 2.49.647.971 1.079 2.103 1.295 3.398.191.887.287 2.301.287 4.243h-14.113c.06 1.953.521 3.52 1.384 4.701.863 1.181 2.2 1.771 4.01 1.771 1.69 0 3.038-.557 4.045-1.672a5.624 5.624 0 0 0 1.222-2.247h3.182c-.083.707-.362 1.495-.836 2.364-.473.869-1.003 1.579-1.591 2.13-.982.959-2.199 1.606-3.649 1.942-.779.192-1.66.288-2.643.288-2.397 0-4.429-.872-6.095-2.616-1.666-1.744-2.499-4.186-2.499-7.327 0-3.092.839-5.603 2.517-7.533 1.678-1.929 3.871-2.894 6.58-2.894Zm5.16 8.522c-.132-1.403-.437-2.523-.917-3.362-.887-1.558-2.367-2.338-4.441-2.338-1.486 0-2.732.537-3.739 1.61-1.007 1.072-1.54 2.436-1.6 4.09h10.697Zm-47.905-28.796c-3.454 3.161-7.871 4.742-13.25 4.742-6.657 0-11.89-2.136-15.7-6.406-3.809-4.291-5.714-10.173-5.714-17.646 0-8.08 2.166-14.307 6.499-18.682 3.768-3.81 8.562-5.715 14.381-5.715 7.787 0 13.481 2.554 17.081 7.661 1.989 2.868 3.056 5.746 3.203 8.635h-9.671c-.628-2.219-1.434-3.893-2.418-5.024-1.758-2.009-4.364-3.014-7.818-3.014-3.517 0-6.29 1.418-8.321 4.254-2.03 2.837-3.046 6.851-3.046 12.042s1.073 9.079 3.219 11.665c2.145 2.585 4.872 3.877 8.179 3.877 3.391 0 5.976-1.109 7.756-3.328.984-1.193 1.8-2.983 2.449-5.369h9.577c-.838 5.045-2.973 9.147-6.406 12.308Zm31.041 4.742c-6.615 0-11.67-1.801-15.166-5.401-4.688-4.417-7.033-10.78-7.033-19.091 0-8.477 2.345-14.841 7.033-19.09 3.496-3.601 8.551-5.401 15.166-5.401s11.67 1.8 15.166 5.401c4.668 4.249 7.002 10.613 7.002 19.09 0 8.311-2.334 14.674-7.002 19.091-3.496 3.6-8.551 5.401-15.166 5.401Zm9.137-12.434c2.24-2.826 3.36-6.845 3.36-12.058 0-5.191-1.125-9.205-3.375-12.041-2.251-2.836-5.291-4.255-9.122-4.255-3.831 0-6.887 1.413-9.168 4.239-2.282 2.826-3.423 6.845-3.423 12.057 0 5.213 1.141 9.232 3.423 12.058 2.281 2.825 5.337 4.238 9.168 4.238 3.831 0 6.877-1.413 9.137-4.238Zm26.049 11.146h-9.012V30.24h14.067l8.415 36.392 8.352-36.392h13.91v46.282h-9.012V45.217c0-.9.011-2.161.032-3.783.021-1.622.031-2.873.031-3.752l-8.76 38.84h-9.388l-8.698-38.84c0 .879.01 2.13.031 3.752.021 1.622.032 2.883.032 3.783v31.305Zm61.152-16.641h-9.827v16.641h-9.609V30.24h20.159c4.647 0 8.352 1.193 11.115 3.58 2.763 2.386 4.144 6.081 4.144 11.083 0 5.464-1.381 9.326-4.144 11.587-2.763 2.26-6.709 3.391-11.838 3.391Zm4.522-9.64c1.256-1.109 1.884-2.867 1.884-5.275 0-2.407-.633-4.123-1.9-5.149-1.266-1.026-3.04-1.539-5.322-1.539h-9.011v13.627h9.011c2.282 0 4.061-.554 5.338-1.664Zm42.596 16.767h-17.05l-3.203 9.514h-10.11l16.516-46.282h10.927l16.39 46.282h-10.487l-2.983-9.514Zm-2.701-7.975-5.777-18.211-5.966 18.211h11.743Zm56.255 17.489h-9.671l-18.902-32.875v32.875h-9.012V30.24h10.142l18.431 32.31V30.24h9.012v46.282Zm43.161-46.282-15.48 28.887v17.395h-9.671V59.127L545.302 30.24h11.397l9.609 20.158 9.199-20.158h10.959Z" />
          <path d="M150 150h-37.5V37.5H0V0h150v150Zm-75 0H21.967L75 96.967V150ZM0 75h53.033L0 128.033V75Z" />
        </svg>
        <span className="font-bold">COMPANY NAME</span>
      </a>
    </div>
  );
}

Logo.propTypes = {
  dashboardUrl: PropTypes.string.isRequired
};

export const layout = {
  areaId: 'header',
  sortOrder: 10
};

export const query = `
  query Query {
    dashboardUrl: url(routeId:"dashboard")
  }
`;
