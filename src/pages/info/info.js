import React from 'react';
import './info.css';

// Simple counter using React Hooks
export const Info = () => {

    return (
        <section className="main-section">
            <div className="row mr-0">
                <div className="col-xl-6 offset-xl-3 info-sub-div">
                    <div className="card info-card-bg">
                        <div className="card-body info-card-body">
                            <h1 className='info-text'>PooSail NFT'S</h1>
                            <p className='info-text'>Utilities
                                <br />
                                - Discount on all future MultiPoo utilities&nbsp;&nbsp;
                                <br />
                                - DAO access
                                <br />
                                - Launchpad access
                                <br />
                                - PooMarketCap Access
                                <br />
                                - Mint reflections
                                <br /><br /></p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};