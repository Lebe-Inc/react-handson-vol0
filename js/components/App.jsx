var React = require("react")

var LogBox = require("./LogBox.jsx")
var InputArea = require("./InputArea.jsx")

var _datas = {};

function number_format(num){
	num = Math.floor(num);
	return ("00"+num).slice(-2);
}

var App = React.createClass({

	getInitialState: function(){
		return{
			data: {}
		}
	},

	render: function(){

		var length = Object.keys(this.state.data).length,
				task = length > 1 ? "tasks" : "task";

		return(
			<div>
				<p className="task-count">{length} {task}</p>
				<InputArea
					create={this._create}
					destroyCompleted={this._destroyCompleted}
					allComplete={this._allComplete}
				/>
				<LogBox
					logData={this.state.data}
					deleteAction={this._destroy}
					updateAction={this._update}
					getInputDefaultValue={this._getInputDefaultValue}
				/>
			</div>
		)
	},

	_getInputDefaultValue: function(id){
		return _datas[id].text;
	},

	_checkDone: function(){
		for(var id in _datas){
			if(!_datas[id].isDone){
				return false;
			}
		}
		return true;
	},

	_allComplete: function(){
		if(this._checkDone()){
			this._updateAll({isDone: false})
		}else{
			this._updateAll({isDone: true})
		}
	},

	_updateAll: function(updates){
		for(var id in _datas){
			this._update(id,updates)
		}
	},

	_update: function(id,updates){
		_datas[id] = Object.assign({},_datas[id],updates)
		this._save();
	},

	_create: function(text){
		var _id = (Date.now() + Math.floor(Math.random() * 999999)).toString(36),
				d = new Date()
		_datas[_id] = {
			id: _id,
			text: text,
			date: number_format(d.getHours()) + ":" + number_format(d.getMinutes()),
			isDone: false
		}
		this._save();
	},

	_destroyCompleted: function(){
		for(var id in _datas){
			if(_datas[id].isDone){
				this._destroy(id);
			}
		}
	},

	_destroy: function(id){
		delete _datas[id];
		this._save();
	},

	_save: function(){
		this.setState({
			data: _datas
		})
	}

})

module.exports = App