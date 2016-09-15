var React = require("react")

var ENTER_KEY_CODE = 13;

var InputArea = React.createClass({

	getInitialState: function(){
		return({
			text: ""
		})
	},

	render: function(){
		return(
			<div className="input-area">
				<button
					className="allComplete"
					onClick={this._allComplete}
				>
				&#10004;
				</button>
				<input
					className="input-text"
					type="text"
					ref="input"
					value={this.state.text}
					placeholder="例）ニンジンを買う"
					onChange={this._edit}
					onKeyDown={this._enterBind}
				/>
				<button
					className="submit-button"
					type="button"
					onClick={this._submit}
				>
				Add
				</button>
				<button
					className="all-clear-btn"
					onClick={this.props.destroyCompleted}
				>
				Clear completed
				</button>
			</div>
		)
	},

	_allComplete: function(){
		this.props.allComplete()
	},

	_edit: function(e){
		this.setState({text: e.target.value})
	},

	_enterBind: function(e){
		if(e.keyCode === ENTER_KEY_CODE) this._submit();
	},

	_submit: function(){
		var text = this.state.text.trim();
		if(text.length < 1 ){
			alert("文字が空です");
			return;
		}
		this.props.create(text)
		this.setState({ text: "" });
		this.refs.input.focus();
		return;
	}

})

module.exports = InputArea