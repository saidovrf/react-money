import React, {Component} from 'react';
import { Switch, Route, Link, Redirect, withRouter } from 'react-router-dom';

import Dashboard from './Dashboard';
import Transactions from './Transactions';
import Login from './Login';
import Register from './Register';

import {Layout, Menu, Icon} from 'antd';
import Query from "../classes/Query";

const {Header, Content} = Layout;


class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			result: [],
			token: localStorage.getItem('token'),
		};
	}

	componentWillMount() {
		this.checkToken();
	}

	checkToken() {
		const token = localStorage.getItem('token');

		if (token) {
			Query.do('api/protected/user-info', 'get', null, token).then(res => {
				this.setToken(token);
			}, err => {
				localStorage.setItem('token', '');
			});
		}
	}

	setToken(token) {
		localStorage.setItem("token", token);
		this.setState({ token: token });
	}

	handleLogout(e) {
		e.key === '/logout' && this.setToken('');
	}

	render() {
		const { pathname } = this.props.location;
		const { token } = this.state;


		return (
			<Layout>
				<Header className="header">

					{
						this.state.token ?
							(

								<Menu
									mode="horizontal"
									defaultSelectedKeys={['/']}
									selectedKeys={[pathname]}
									theme='dark'
									style={{height: '100%', borderRight: 0, lineHeight: '64px', textAlign: 'center'}}
									onClick={this.handleLogout.bind(this)}
								>
									<Menu.Item key="/">
										<Link to='/'>
											<Icon type="dashboard" />
											<span>Dashboard</span>
										</Link>
									</Menu.Item>


									<Menu.Item key="/transactions">
										<Link to='/transactions'>
											<Icon type="credit-card" />
											<span>Transactions</span>
										</Link>
									</Menu.Item>

									<Menu.Item key="/logout">
										<span>Logout</span>
									</Menu.Item>
								</Menu>
							) :
							(

								<Menu
									mode="horizontal"
									defaultSelectedKeys={['/']}
									selectedKeys={[pathname]}
									theme='dark'
									style={{height: '100%', borderRight: 0, lineHeight: '64px', textAlign: 'center'}}
									onSelect={(item) => this.setState({menuSelected: item.key})}
								>
									<Menu.Item key="/">
										<Link to='/'>
											<Icon type="rocket" />
											<span>Login</span>
										</Link>
									</Menu.Item>


									<Menu.Item key="/register">
										<Link to='/register'>
											<Icon type="user-add" />
											<span>Register</span>
										</Link>
									</Menu.Item>
								</Menu>

							)
					}

				</Header>
					<Layout style={{padding: '0 24px 24px'}}>
						<Content style={{background: '#fff', padding: 24, margin: 0, minHeight: 280}}>

							<Switch>
								<Route exact path='/' render={() =>
									this.state.token ?
									( <Dashboard token={token} checkToken={this.checkToken.bind(this)}/> ) :
									( <Login setToken={this.setToken.bind(this)}/> )
								}/>
								<Route path='/transactions' render={() =>
									!this.state.token ?
									( <Redirect to='/'/> ) :
									( <Transactions token={token} checkToken={this.checkToken.bind(this)}/> )
								}/>
								<Route path='/register' render={() =>
									this.state.token ?
									( <Redirect to='/'/> ) :
									( <Register setToken={this.setToken.bind(this)}/> )
								}/>
							</Switch>

						</Content>
					</Layout>


			</Layout>
		);
	}
}

export default withRouter(props => <App {...props}/>);