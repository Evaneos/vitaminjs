import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'vitaminjs/react-redux';
import { compose } from 'vitaminjs/redux';
import { resolve } from 'vitaminjs/react-resolver';
import { loadRepo, loadStargazers } from '../actions';
import Repo from '../components/Repo';
import User from '../components/User';
import List from '../components/List';

let currentFullName;
const loadData = props => {
    const { fullName } = props;
    if (fullName === currentFullName) {
        return;
    }
    currentFullName = fullName;
    return Promise.all([
        props.loadRepo(fullName, ['description']),
        props.loadStargazers(fullName),
    ]);
};

class RepoPage extends Component {
    static propTypes = {
        repo: PropTypes.object,
        fullName: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        owner: PropTypes.object,
        stargazers: PropTypes.array.isRequired,
        stargazersPagination: PropTypes.object,
        loadRepo: PropTypes.func.isRequired,
        loadStargazers: PropTypes.func.isRequired,
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.fullName !== this.props.fullName) {
            loadData(nextProps);
        }
    }

    handleLoadMoreClick = () => {
        this.props.loadStargazers(this.props.fullName, true);
    };

    renderUser(user) {
        return <User user={user} key={user.login} />;
    }

    render() {
        const { repo, owner, name } = this.props;
        if (!repo || !owner) {
            return <h1><i>Loading {name} details...</i></h1>;
        }

        const { stargazers, stargazersPagination } = this.props;
        return (
            <div>
                <Repo repo={repo} owner={owner} />
                <hr />
                <List
                    renderItem={this.renderUser}
                    items={stargazers}
                    onLoadMoreClick={this.handleLoadMoreClick}
                    loadingLabel={`Loading stargazers of ${name}...`}
                    {...stargazersPagination}
                />
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    // We need to lower case the login/name due to the way GitHub's API behaves.
    // Have a look at ../middleware/api.js for more details.
    const login = ownProps.params.login.toLowerCase();
    const name = ownProps.params.name.toLowerCase();

    const {
        pagination: { stargazersByRepo },
        entities: { users, repos },
    } = state;

    const fullName = `${login}/${name}`;
    const stargazersPagination = stargazersByRepo[fullName] || { ids: [] };
    const stargazers = stargazersPagination.ids.map(id => users[id]);

    return {
        fullName,
        name,
        stargazers,
        stargazersPagination,
        repo: repos[fullName],
        owner: users[login],
    };
};

export default compose(
    connect(mapStateToProps, { loadRepo, loadStargazers }),
    resolve('__resolvedData', loadData),
)(RepoPage);
