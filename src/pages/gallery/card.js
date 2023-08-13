import React, { useEffect, useState } from 'react';
import './gallery.css';
import bgImg from '../../assets/img/11.png';

// Simple counter using React Hooks
export const Card = ({ item }) => {
    const [collapsed, setCollapsed] = useState(true);

    return (
        <div className="col-xl-4 offset-xl-0 info-sub-div" >
            <div style={{ textAlign: "center" }}>
                <img src={item.image} style={{ width: "187px" }} />
            </div>
            <div className="dropdown menu_links" style={{ textAlign: "center" }}>
                <button className="btn btn-primary dropdown-toggle gallery-metadata" aria-expanded="false" data-bs-toggle="dropdown" type="button">
                    {
                        item.name
                    }</button>
                <div className="dropdown-menu gallery-menulink">
                    {
                        item.attributes.map((attr, i) => (
                            <li key={i} className="list-group-item d-flex align-items-center" style={{ background: "rgba(255,255,255,0)" }}>
                                <a className="dropdown-item gallery-example" href="#">
                                    {/* <p style={{ wordBreak: "break-all" }}>{attr.trait_type} : <span style={{ maxWidth: "200px", overflow: "hidden" }}>{attr.value}</span></p></a></li> */}
                                    <p style={{ margin: "0" }}>{attr.trait_type} : {attr.value}</p></a></li>
                        ))
                    }
                </div>
            </div>
        </div>
    );
};