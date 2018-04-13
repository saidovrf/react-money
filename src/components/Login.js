import React, {Component} from 'react';
import {withRouter} from "react-router-dom";

import Query from '../classes/Query';

import {AutoComplete, Input, Button, Alert} from 'antd';
const Option = AutoComplete.Option;


class Login extends Component {

	constructor(props) {
		super(props);

		this.state = {
			result: [],
			error: '',
			loading: false,

			email: '',
			password: ''
		};
	}

	handleSearch = (value) => {
		let result;
		if (!value || value.indexOf('@') >= 0) {
			result = [];
		} else {
			result = ['gmail.com', 'yandex.ru', 'mail.ru'].map(domain => `${value}@${domain}`);
		}
		this.setState({ result });
	}

	onClick() {
		const { email, password } = this.state;

		this.setState({ loading: true });

		Query.do('sessions/create', 'post', {
			email, password
		}).then(res => {
			this.setState({ loading: false });
			this.props.setToken(res.payload.id_token);
		}, err => {
			this.setState({ error: err.payload, loading: false});
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

				Email:<br/>
				<AutoComplete
					style={{width: '100%'}}
					onChange={e => this.setState({ email: e })}
					onSearch={this.handleSearch.bind(this)}
				>
					{children}
				</AutoComplete>

				<br/>

				Password:<br/>
				<Input type='password' onChange={e => this.setState({ password: e.target.value })} /><br/><br/>


				<Button onClick={this.onClick.bind(this)} disabled={!this.state.email || !this.state.password} type="primary" loading={this.state.loading}>Login</Button>
			</div>
		);
	}
}

export default withRouter(props => <Login {...props}/>);