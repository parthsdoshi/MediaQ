import { connect } from 'react-redux';

import { hideSearchAction } from "../actions/index";
import Search from './Search';

const mapStateToProps = state => {
    return {
        showModal: state.showSearchModal
    }
}

const mapDispatchToProps = dispatch => {
    return {
        hideSearch: () => dispatch(hideSearchAction())
    }
}

const SearchContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Search)

export default SearchContainer;
