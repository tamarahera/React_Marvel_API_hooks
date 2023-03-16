import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {
    const {loading, request, error, clearError} = useHttp();

    const _apiBase = `https://gateway.marvel.com:443/v1/public/`; //лодаш неформально означає що ми не можемо змінювати ці дані
    const _apiKey = `apikey=03bceba952252af3375580476ec6cb07`;
    const _baseOffsetCharacters = 210;

    const getAllCharacters = async (offsetCharacters = _baseOffsetCharacters) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offsetCharacters}&${_apiKey}`);
        return res.data.results.map(_transformCharacter);
    }

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transformCharacter(res.data.results[0]);
    }

    const getAllComics = async(offset = 0) => {
        const res = await request (`${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transformComics);
    }

    const getComic = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
        return _transformComics(res.data.results[0]);
    }


    const _transformCharacter = (char) => {
        return {
            id: char.id,
            name: char.name,
            description: char.description ? `${char.description.slice(0, 210)}...` : 'There is no description for this character',
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items.slice(0, 9)
        }
    }

    const _transformComics = (comics) => {
        return {
            id: comics.id,
            title: comics.title,
            description: comics.description ? comics.description : 'There is no description for this comics',
            thumbnail: comics.thumbnail.path + '.' + comics.thumbnail.extension,
            price: comics.prices[0].price !== 0 ? `${comics.prices[0].price}$` : 'Not available price',
            pageCount: comics.pageCount < 1 ? 'No information about the number of pages' : `${comics.pageCount} pages`,
            language: comics.textObjects[0]?.language || "en-us"
        }
    }
    return {loading, error, clearError, getAllCharacters, getCharacter, getAllComics, getComic}
}

export default useMarvelService;