
import React from 'react';
import './MainBanner.scss';

export default function MainBanner() {
  return (
    <div className="main-banner-home flex items-center justify-center">
      <div className="container text-center">

        {/* Banner Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {/* Container 1 */}
          <div className="banner-section">
            <h3 className="section-title">FASHION</h3>
            <div className="image-container">
              <img src='/fashion.jpg' alt="Fashion" />
            </div>
          </div>

          {/* Container 2 */}
          <div className="banner-section">
            <h3 className="section-title">ELECTRONICS & ACCESSORIES</h3>
            <div className="image-container">
              <img src='/electronics.jpg' alt="Electronics" />
            </div>
          </div>

          {/* Container 3 */}
          <div className="banner-section">
            <h3 className="section-title">HOME & DECOR</h3>
            <div className="image-container">
              <img src='/home_decor.jpg' alt="Home and Decor" />
            </div>
          </div>
        </div>

        {/* Shop Now Button */}
        <a className="shop-now-button inline-block mt-8">Shop Now</a>
      </div>
    </div>
  );
}

export const layout = {
  areaId: 'content',
  sortOrder: 1
};
