import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CircularImageSlider.css'; // Import the CSS file for styling

const CircularImageSlider = () => {
    const BASE_API_URL = process.env.REACT_APP_API_URL;

    const [images, setImages] = useState([]);
    const [imageKeys, setImageKeys] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axios.get(`${BASE_API_URL}/companylogos`);
                const imagesMap = response.data;

                // Convert the response data into an array of images
                const imagesArray = Object.entries(imagesMap).map(([id, imageData]) => ({
                    id: parseInt(id, 10),
                    src: `data:image/jpeg;base64,${imageData}`
                }));

                // Map the image src to their IDs for navigation
                const imageSrcKeys = imagesArray.reduce((acc, { id, src }) => {
                    acc[src] = id;
                    return acc;
                }, {});

                setImageKeys(imageSrcKeys);
                // Duplicate images for smooth infinite scroll
                setImages([...imagesArray, ...imagesArray]);
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        fetchImages();
    }, []);

    const handleImageClick = (imageSrc) => {
        const key = imageKeys[imageSrc];
        if (key) {
            navigate(`/jobboxCompanyPage/eachCompanyPage`, { state: { companyId: key } });
        }
    };

    return (
        <div className="image-slider-container">
            <div className="image-slider">
                {images.map((img, index) => (
                    <div className="image-wrapper" key={index} onClick={() => handleImageClick(img.src)}>
                        <img className="square-image" src={img.src} alt={`Company logo ${index}`} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CircularImageSlider;
