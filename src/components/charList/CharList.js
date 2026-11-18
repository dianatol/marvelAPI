
import { Component } from 'react';
import Spinner from '../spinner/SpinnerTemp';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';
import './charList.scss';

class CharList extends Component {

    state = {
        charList: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 0,
        charEnded: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.onRequest(this.state.offset);
    }

    componentWillUnmount() {
    }

    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError);

    }

    onCharListLoading = () => {

        this.setState({
            newItemLoading: true
        })
    }

    onCharListLoaded = (newCharList) => {


        let ended = false;
        if (newCharList.length < 9) {
            ended = true
        }


        this.setState(({ offset, charList }) => ({
            charList: [...charList, ...newCharList],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: newCharList.length < 9}));
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        });
    }

    renderItems(arr) {
        const items = arr.map((item) => {
            return (
                <li className="char__item" key={item.id}
                    onClick={() => this.props.onCharSelected(item.id)}>
                    <img src={item.thumbnail} alt={item.name} />
                    <div className="char__name">{item.name}</div>
                </li>
            );
        });

        return items;
    }

    render() {
        const { charList, loading, error, offset, newItemLoading, charEnded } = this.state;

        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner /> : null;
        const content = !(loading || error)
            ? this.renderItems(charList)
            : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                <ul className="char__grid">
                    {content}
                </ul>
                <button
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{ 'display': charEnded ? 'none' : 'block' }}
                    onClick={() => this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        );
    }
}

export default CharList;
