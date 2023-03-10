import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton'


import './charInfo.scss';

const CharInfo = (props) => {

    const [char, setChar] = useState(null);

    const {loading, error, getCharacter, clearError} =  useMarvelService();

    useEffect(() => {
        updateChar();
    }, [props.charId])

    //в старій версії реакту самі створювали запобіжники, в новій версії реакту це включено
    // запобіжники - наразі ТІЛЬКИ класові компоненти, які обертають інші компоненти, якщо в їх дочірніх к. відб помилка - то запобіжники будуть її ловити, ломається лиш цей компонент
    // дод ф-л: можемо відрендерити інший ел замість того, що зламався та можемо записати цю помилку
/*     componentDidCatch(err, info) {
        this.setState({
            error: true
        })
    } */

    const updateChar = () => {
        const {charId} = props;
        if (!charId) {
            return;
        }

        clearError();
        getCharacter(charId)
            .then(onCharLoaded);;
    }

    const onCharLoaded = (char) => {
        setChar(char);
    }

    const skeleton = char || loading || error ? null : <Skeleton/>;
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !char) ? <View char={char}/> : null;

    return (
        <div className="char__info">
            {skeleton}
            {errorMessage}
            {spinner}
            {content}
        </div>
    )    
}

const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = char;

    return (
        <>
            <div className="char__basics">
            <img src={thumbnail} alt={name}/>
            <div>
                <div className="char__info-name">{name}</div>
                <div className="char__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length > 0 ? null : 'There is no comics with this character'}
                {
                    comics.map((item, i) => {
                        return (
                            <li key={i} className="char__comics-item">
                                {item.name}
                            </li>
                        )
                    })
                }
            </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;