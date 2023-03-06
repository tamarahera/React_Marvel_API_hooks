import { useState, useEffect/* , useRef */} from 'react';
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';
import './charList.scss';

const CharList = (props) => {

    const [charList, setCharList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offsetCharacters, setOffsetCharacters] = useState(210);
    const [charEnded, setCharEnded] = useState(false);
    
    const marvelService = new MarvelService();

    useEffect(() => {
        onRequest(); 
    }, []) // пустий масив - симуляція componentDidMount()

    const onRequest = (offsetCharacters) => {
        onCharListLoading();
        marvelService.getAllCharacters(offsetCharacters)
            .then(onCharListLoaded)
            .catch(onError)
    }

    const onCharListLoading = () => {
        setNewItemLoading(true);
    }
    
    const onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        setCharList(charList => [...charList, ...newCharList]); //маємо дочекатися завантаж минулого стейту
        setLoading(loading => false);
        setNewItemLoading(setNewItemLoading => false);
        setOffsetCharacters(offsetCharacters => offsetCharacters + 9);
        setCharEnded(charEnded => ended);
    }

    const onError = () => {
        setError(true); //тут не обов'язково чекати мин стейт
        setLoading(false);
    }

/*     const itemRefs = useRef([]);

    const focusOnItem = (id) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs[id].current.classList.add('char__item_selected');
        itemRefs[id].current.focus();
    } */

    // оптимізація, щоб не ставити це в рендер
    function renderItems(arr) {
        const items =  arr.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            
            return (
                <li 
                    className="char__item"
                    key={item.id}
                    tabIndex={0}
                    /* ref={elLink => itemRefs.current[i] = elLink} */
                    onClick={() => {
                        props.onCharSelectedProp(item.id);
                        item[i].focus();
                    }}
                    onFocus={() => this.props.onCharSelectedProp(item.id)}>
                        <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                        <div className="char__name">{item.name}</div>
                </li>
            )
        });
        // центрування спінера та помилки
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }
   
    const items = renderItems(charList);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error) ? items : null;

    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {content}
            <button className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{'display': charEnded ? 'none' : 'block'}}
                    onClick={() => onRequest(offsetCharacters)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

CharList.propTypes = {
    onCharSelectedProp: PropTypes.func.isRequired
}

export default CharList;