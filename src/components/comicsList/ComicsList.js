import { useState, useEffect } from 'react';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';
import './comicsList.scss';
import uw from '../../resources/img/UW.png';
import xMen from '../../resources/img/x-men.png';

const ComicsList = () => {

    const [comicsList, setComicsList] = useState([]);

    const {loading, error, getAllComics} = useMarvelService();

    useEffect(() => {
        onRequest();
    }, [])

    const onRequest = () => {
        getAllComics()
            .then(onComicsListLoaded)
    }

    const onComicsListLoaded = (data) => {
        setComicsList(data)
    }

    function renderItems(data) {
        const items = data.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'contain'};
            }

            return (
                <li 
                    key={item.id} 
                    className="comics__item">
                    <a href="#">
                        <img src={item.thumbnail} alt={item.title} className="comics__item-img" style={imgStyle} tabIndex={0}/>
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </a>
                </li>
            )
        });
        return items;
    }

    const items = renderItems(comicsList);

    return (
        <div className="comics__list">
            <ul className="comics__grid">
                {items}
            </ul>
            <button className="button button__main button__long">
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;