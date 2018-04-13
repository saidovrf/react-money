import React, {Component} from 'react';
import {withRouter} from "react-router-dom";

import Query from '../classes/Query';

import {AutoComplete, Input, Button, Alert} from 'antd';
const Option = AutoComplete.Option;


class Register extends Component {

	constructor(props) {
		super(props);

		this.state = {
			result: [],
			error: '',
			loading: false,

			buttonDisabled: true,

			username: '',
			email: '',
			password: ''
		};
	}

	handleSearch(value) {
		let result;
		if (!value || value.indexOf('@') >= 0) {
			result = [];
		} else {
			result = ['gmail.com', 'yandex.ru', 'mail.ru'].map(domain => `${value}@${domain}`);
		}
		this.setState({ result });
	}

	handlePassword(value) {
		if (this.state.password === value)
			this.setState({buttonDisabled: false});
		else
			this.setState({buttonDisabled: true});
	}

	onClick() {

		this.setState({ loading: true });

		const { username, email, password } = this.state;
		console.log(username,email,password)

		Query.do('users', 'post', {
			username, email, password
		}).then(res => {
			console.log(res)
			this.setState({ loading: false });
			// this.props.setToken(res.payload.id_token);
		}, err => {
			console.log(err)
			this.setState({ error: err.payload, loading: false });
		});
	}


	render() {

		const { result } = this.state;
		const children = result.map((email) => {
			return <Option key={email}>{email}</Option>;
		});

		return (
			<div>
				{
					this.state.error ? (
						<Alert
							message="Ops..."
							description={this.state.error}
							type="error"
							closable
						/>
					) : ''
				}
				<br/>

				Username:<br/>
				<Input onChange={e => this.setState({username: e.target.value})}/><br/>

				Email:<br/>
				<AutoComplete
					style={{width: '100%'}}
					onChange={e => this.setState({email: e})}
					onSearch={this.handleSearch.bind(this)}
				>
					{children}
				</AutoComplete>

				<br/>

				Password:<br/>
				<Input type='password' onChange={e => this.setState({password: e.target.value})} /><br/>

				Password again:<br/>
				<Input type='password' onChange={e => this.handlePassword(e.target.value)} /><br/><br/>


				<Button onClick={this.onClick.bind(this)} type="primary" disabled={this.state.buttonDisabled} loading={this.state.loading}>Register</Button>
			</div>
		);
	}
}

export default withRouter(props => <Register {...props}/>);