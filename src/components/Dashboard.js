import React, {Component} from 'react';
import {withRouter} from "react-router-dom";

import Query from "../classes/Query";

import {Card, Button, Steps, AutoComplete, InputNumber, Icon, Alert} from 'antd';
const Step = Steps.Step;

let dataSource = [
	'Rus'
];


class Dashboard extends Component {

	constructor(props) {
		super(props);


		this.state = {
			current: 0,
			statuses: {
				step0: 'error',
				step1: 'error',
				step2: 'wait'
			},
			username: '',
			amount: 0,
			transaction: {
				type: '',
				text: '',
				loading: true,
				data: {}
			},
			user: {
				balance: (<Icon type="loading" />),
				email: (<Icon type="loading" />),
				id: 0,
				name: (<Icon type="loading" />)
			}
		};

		if (this.props.location.state && this.props.location.state.username) {
			this.state.current = 1;
			this.state.username = this.props.location.state.username;
		}
	}

	componentWillMount() {
		this.props.checkToken();
	}

	componentDidMount() {
		Query.do('api/protected/user-info', 'get', null, this.props.token)
			.then(res => {
				dataSource = [res.payload.user_info_token.name];
				this.setState({user: res.payload.user_info_token});
			}, err => {
				alert(`There is some error: ${err}`);
			});
	}

	next() {
		const current = this.state.current + 1;

		if (current === 2) {

			Query.do('api/protected/transactions', 'post', {
				name: this.state.username,
				amount: this.state.amount
			}, this.props.token)
				.then(res => {
					this.setState({transaction: {
							type: 'success',
							loading: false,
							data: res.trans_token
						}});

					Query.do('api/protected/user-info', 'get', null, this.props.token)
						.then(res => {
							dataSource = [res.payload.user_info_token.name];
							this.setState({user: res.payload.user_info_token});
						}, err => {
							alert(`There is some error: ${err}`);
						});
				}, err => {
					this.setState({transaction: {
							type: 'error',
							text: err,
							loading: false
						}});
				});
		}
		this.setState({ current });
	}
	prev() {
		const current = this.state.current - 1;
		this.setStepStatus(current, 'error');
		this.setState({ current });
	}
	done() {
		this.setState({
			current: 0,
			statuses: {
				step0: 'error',
				step1: 'error',
				step2: 'wait'
			},
			username: '',
			amount: 0,
			transaction: {
				type: '',
				text: '',
				loading: true,
				data: {}
			},
		})
	}

	onUserChange(a,b,c) {
		if (b.props.value)
			this.setStepStatus(this.state.current, 'error');
	};

	onUserSelect(value) {
		this.setStepStatus(this.state.current);
		this.setState({username: value});
	};

	onAmountChange(value) {
		if ( value > this.state.user.balance || value <= 0)
			this.setStepStatus(this.state.current, 'error');
		else
			this.setStepStatus(this.state.current);

		this.setState({amount: value});
	}


	setStepStatus(index, status = 'finish') {
		let { statuses } = this.state;
		statuses[`step${index}`] = status;

		return this.setState({statuses});
	}

	render() {
		const { current } = this.state;



		const steps = [{
			title: 'User choose',
			content: (
				<div className='dashboard__block'>
					Username:<br/>
					<AutoComplete
						dataSource={dataSource}
						style={{ width: 200 }}
						onChange={this.onUserChange.bind(this)}
						onSelect={this.onUserSelect.bind(this)}
						placeholder="Start typing..."
					/>
				</div>
			),
		}, {
			title: 'Amount',
			content: (
				<div className='dashboard__block'>
					Amount value:<br/>
					<InputNumber
						defaultValue={0}
						value={this.state.amount}
						onChange={this.onAmountChange.bind(this)}
					/> PW
				</div>
			),
		}, {
			title: 'Done',
			content: (
				<div>
					{
						!this.state.transaction.loading ?
							this.state.transaction.type === 'success' ?
								(
									<div>Done</div>
								) :
								(
									<Alert
										message="Ops..."
										description={this.state.transaction.text}
										type={this.state.transaction.type}
									/>
								)
							:
							(
								<h1><Icon type='loading'/></h1>
							)
					}
				</div>
			),
		}];

		const stepStatus = this.state.statuses[`step${current}`];

		return (
			<Card title={
				<div className='transactions-head'>
					<h1 className='transactions-head__name'>{this.state.user.name}</h1>
					{this.state.user.email}
				</div>
			} extra={
				<div className='transactions-head'>
					<h1 className='transactions-head__balance'>{this.state.user.balance}</h1>
					current balance
				</div>
			}>

				<Steps current={current} status={stepStatus}>
					{steps.map(item => <Step key={item.title} title={item.title} />)}
				</Steps>
				<div className="steps-content">{steps[this.state.current].content}</div>
				<div className="steps-action">
					{
						this.state.current < steps.length - 1
						&&
						<Button disabled={stepStatus === 'error'} type="primary" onClick={this.next.bind(this)}>Next</Button>
					}
					{
						this.state.current === steps.length - 1
						&&
						<Button type="primary" onClick={this.done.bind(this)}>Done</Button>
					}
					{
						this.state.current > 0
						&&
						<Button style={{ marginLeft: 8 }} onClick={this.prev.bind(this)}>
							Previous
						</Button>
					}
				</div>
			</Card>

		);
	}
}

export default withRouter(props => <Dashboard {...props}/>);