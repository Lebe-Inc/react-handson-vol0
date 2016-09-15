var React = require("react")

var LogItem = React.createClass({

	render: function(){

		var id = this.props.logs.id,
				text = this.props.logs.text,
				date = this.props.logs.date,
				doneClass = "";

		doneClass = this.props.logs.isDone ? "logitem done" : "logitem";

		return(
			<li id={id} className={doneClass} onClick={this._check}>
				<div className="clearfix">
					<p className="text">{text}</p>
					<small className="date">{date}</small>
				</div>
				<p onClick={this._delete} className="delete">&times;</p>
				<p onClick={this._edit} className="edit">edit</p>
			</li>
		)
	},

	_check: function(e){
		var id = e.target.id;
		if(id){
			this.props.updateAction(id,{
				isDone: !this.props.logs.isDone
			});
		}
	},

	_delete: function(e){
		this.props.deleteAction(e.target.parentElement.id);
		return;
	},

	_edit: function(e){
		var id = e.target.parentElement.id,
				_text = prompt("変更内容を記述してください",this.props.getInputDefaultValue(id))
		if(_text !== null){
			this.props.updateAction(id,{text: _text})
		}
		return;
	}

})

module.exports = LogItem