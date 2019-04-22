import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default class Users extends Component {
  constructor(props) {
    super(props);
    if (!props.match.params.searchTerm) {
      this.state = {
        users: [],
        count: '',
        searchTerm: '',
        go: true,
        clear: true,
      };
    } else {
      this.state = {
        users: [],
        count: '',
        searchTerm: props.match.params.searchTerm
          ? props.match.params.searchTerm
          : '',
        go: true,
        clear: !props.match.params.searchTerm,
      };
    }
  }
  componentDidMount() {
    this.load();
  }
  componentDidUpdate(prevProps) {
    const { match } = this.props;
    if (
      prevProps.match.params.index !== match.params.index ||
      prevProps.match.params.searchTerm !== match.params.searchTerm
    ) {
      this.setState({
        searchTerm: match.params.searchTerm ? match.params.searchTerm : '',
        go: true,
        clear: !match.params.searchTerm,
      });
      this.load();
    }
  }
  load = () => {
    const { match } = this.props;
    axios
      .get(
        `https://acme-users-api.herokuapp.com/api/users/${
          match.params.searchTerm
            ? `search/${match.params.searchTerm}/${match.params.index || ''}`
            : match.params.index || ''
        }`
      )
      .then(response => response.data)
      .then(usersAndCount => {
        this.setState({
          users: usersAndCount.users,
          count: usersAndCount.count,
        });
      });
  };
  onChange = ev => {
    const { match } = this.props;
    if (ev.target.value !== match.params.searchTerm) {
      this.setState({ go: false });
    }
    if (!ev.target.value || ev.target.value === match.params.searchTerm) {
      this.setState({ go: true });
    }
    this.setState({ [ev.target.name]: ev.target.value });
  };
  pageChange = index => {
    const { history, match } = this.props;
    history.push(
      `/users/${
        match.params.searchTerm
          ? `search/${match.params.searchTerm}/${index}`
          : index
      }`
    );
  };
  searchByTerm = () => {
    const { searchTerm } = this.state;
    const { history } = this.props;
    history.push(`/users/search/${searchTerm}/`);
  };
  render() {
    const { match, history } = this.props;
    const { users, count, searchTerm, go, clear } = this.state;
    const { pageChange, onChange, searchByTerm } = this;
    const current = match.params.index ? match.params.index * 1 : 0;
    const pages = Math.floor(count / 50);
    const first = !(match.params.index * 1);
    const last = current === pages;
    const hiLite = (str, term = '') => {
      return str.toLowerCase().includes(term.toLowerCase()) ? (
        <div>
          {str.slice(0, str.toLowerCase().indexOf(term.toLowerCase()))}
          <span style={{ backgroundColor: 'gold' }}>
            {str.slice(
              str.toLowerCase().indexOf(term.toLowerCase()),
              str.toLowerCase().indexOf(term.toLowerCase()) + term.length
            )}
          </span>
          {str.slice(
            str.toLowerCase().indexOf(term.toLowerCase()) + term.length
          )}
        </div>
      ) : (
        str
      );
    };
    return (
      <div>
        {`${count} Results. Page ${current + 1}  of ${pages + 1}`}
        <br />
        <br />
        <div className="btn-group">
          <button
            className="btn btn-info"
            disabled={first ? 'disabled' : ''}
            onClick={() => pageChange(current - current)}
          >
            First
          </button>
          <button
            className="btn btn-info"
            disabled={first ? 'disabled' : ''}
            onClick={() => pageChange(current - 1)}
          >
            Prev
          </button>
          <Link to={match.url} className="btn btn-primary">
            {current + 1}
          </Link>
          <button
            className="btn btn-info"
            disabled={last ? 'disabled' : ''}
            onClick={() => pageChange(current + 1)}
          >
            Next
          </button>
          <button
            className="btn btn-info"
            disabled={last ? 'disabled' : ''}
            onClick={() => pageChange(pages)}
          >
            Last
          </button>
        </div>
        <br />
        <div className="m-2">
          <div className="input-group">
            <input
              placeholder="Search Results"
              className="form-control"
              name="searchTerm"
              value={searchTerm}
              onChange={onChange}
            />
            <div className="input-group-append">
              <button
                className="btn btn-primary"
                onClick={() => searchByTerm()}
                disabled={go}
              >
                {' '}
                Go{' '}
              </button>
              <button
                className="btn btn-info"
                disabled={clear}
                onClick={() => {
                  history.push('/users');
                }}
              >
                {' '}
                Clear{' '}
              </button>
            </div>
          </div>
        </div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Middle Name</th>
              <th>Email</th>
              <th>Title</th>
            </tr>
          </thead>
          <tbody>
            {clear
              ? users.map(user => (
                  <tr key={user.id}>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.middleName}</td>
                    <td>{user.email}</td>
                    <td>{user.title}</td>
                  </tr>
                ))
              : users.map(user => (
                  <tr key={user.id}>
                    <td>{hiLite(user.firstName, match.params.searchTerm)}</td>
                    <td>{hiLite(user.lastName, match.params.searchTerm)}</td>
                    <td>{hiLite(user.middleName, match.params.searchTerm)}</td>
                    <td>{hiLite(user.email, match.params.searchTerm)}</td>
                    <td>{hiLite(user.title, match.params.searchTerm)}</td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    );
  }
}
