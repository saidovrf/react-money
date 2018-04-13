import React, {Component} from 'react';
import { Link, withRouter } from "react-router-dom";

import Query from '../classes/Query';

import { Table, Icon } from 'antd';

const columns = [{
	title: 'User',
	dataIndex: 'username',
	render: (text, obj) => (<div>{text} <Link to={{
		pathname: `/`,
		state: {
			username: obj.username
		}
	}} ><Icon type='select'/></Link></div>),
	sorter: (a, b) => a.username.localeCompare(b.username)
}, {
	title: 'Amount',
	dataIndex: 'amount',
	sorter: (a, b) => a.amount - b.amount,
	render: (text) => `${text} PW`
}, {
	title: 'Balance',
	dataIndex: 'balance',
	sorter: (a, b) => a.balance - b.balance,
	render: (text) => `${text} PW`
}, {
	title: 'Date',
	dataIndex: 'date',
	sorter: (a, b) => a.date.localeCompare(b.date),
	defaultSortOrder: 'descend'
}];

class Transactions extends Component {

	constructor(props) {
		super(props);

		this.state = {
			transactions: {
				data: [],
				loading: true
			}
		};
	};

	componentWillMount() {
		this.props.checkToken();
	}

	componentDidMount() {
		Query.do('api/protected/transactions', 'get', null, this.props.token)
			.then(res => {
				this.setState({transactions: {data: res.payload.trans_token, loading: false}})
			}, err => {
				alert(`There is some error: ${err}`);
			});
	}

	render() {



		return (
			<div>
				<h1>Transactions history</h1>

				<Table rowKey='id' columns={columns} dataSource={this.state.transactions.data} loading={this.state.transactions.loading} />
			</div>
		);
	}
}

export default withRouter(props => <Transactions {...props}/>);