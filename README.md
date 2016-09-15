# react-handson-vol0

## 教材内容

TODOを作りましょう！

## ハンズオン

Todoを作っていきます。

まずは`App.js`をつくります。

```js
var React = require("react");
var ReactDOM = require("react-dom");
 
var App = require("./components/App.jsx");
 
ReactDOM.render(
	<App/>,
	document.getElementById("react")
)
```

今回のTodoでは、4つのファイルに分けたいと思います。

- App.jsx
- InputArea.jsx
- LogBox.jsx
- LogItem.jsx

App.jsxでは、Todoのデータを管理しています。

InputArea.jsxでは、テキストの入力、追加ボタンなどの操作をできるようにします。

LogBoxではただLogItemをリスト表示するための場所を作り、LogItemには編集や削除などの機能をもたせます。


では、`App.jsx`を作っていきます。

```js
var React = require("react");
 
var LogBox = require("./LogBox.jsx");
var InputArea = require("./InputArea.jsx");
 
var _datas = {};
 
function number_format(num){ // 数字のフォーマットを消える
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
	
	/*
	*   編集機能のデフォルトの値をかえす
	*/
	_getInputDefaultValue: function(id){
		return _datas[id].text;
	},

  /*
  * 	全部終わっているかを確認
  */
	_checkDone: function(){
		for(var id in _datas){
			if(!_datas[id].isDone){
				return false;
			}
		}
		return true;
	},

  /*
  * 	全てチェックする
  */
	_allComplete: function(){
		if(this._checkDone()){
			this._updateAll({isDone: false})
		}else{
			this._updateAll({isDone: true})
		}
	},

  /*
  * 	全てupdate
  */
	_updateAll: function(updates){
		for(var id in _datas){
			this._update(id,updates)
		}
	},

  /*
  * 	編集や、doneなどのupdate
  */
	_update: function(id,updates){
		_datas[id] = Object.assign({},_datas[id],updates)
		this._save();
	},

  /*
  *   新しく作る
  */
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

  /*
  *   終わっているものを全て消す
  */
	_destroyCompleted: function(){
		for(var id in _datas){
			if(_datas[id].isDone){
				this._destroy(id);
			}
		}
	},

  /*
  *   削除
  */
	_destroy: function(id){
		delete _datas[id];
		this._save();
	},

  /*
  * 	stateを更新
  */
	_save: function(){
		this.setState({
			data: _datas
		})
	}
 
})
 
module.exports = App
```

`App.jsx`には、基本的なメソッドを全て実装して`_save`でstateを更新します。

`_datas`自体にデータをもたせて`_save`を実行する書き方は、facebook/fluxでも活用されている書き方なので

是非覚えてください！

では、入力をする`InputArea.jsx`を作っていきましょう！

```js
var React = require("react");
 
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
	
	/*
	*   全てをdoneに
	*/
	_allComplete: function(){
		this.props.allComplete()
	},

  /*
  * 	編集機能
  */
	_edit: function(e){
		this.setState({text: e.target.value})
	},

  /*
  *   enterでcreateできるように
  */
	_enterBind: function(e){
		if(e.keyCode === ENTER_KEY_CODE) this._submit();
	},

  /*
  *   create
  */
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
 
module.exports = InputArea;
```

ここまでで、入力系のものを書き終えました。

次はそのデータ表示する場所を作っていってあげます。

`LogItem`を囲む`LogBox.jsx`を作っていきましょう。

```js
var React = require("react");
 
var LogItem = require("./LogItem.jsx");
 
var LogBox = React.createClass({
 
	render: function(){
 
		var logItems = [],
				allMessages = this.props.logData;
 
		for(var key in allMessages){
			logItems.unshift(
				<LogItem
					key={key}
					logs={allMessages[key]}
					deleteAction={this.props.deleteAction}
					updateAction={this.props.updateAction}
					getInputDefaultValue={this.props.getInputDefaultValue}
				/>
			)
		}
 
		return(
			<div>
				<ul className="logbox">
					{logItems}
				</ul>
			</div>
		)
	}
 
})
 
module.exports = LogBox;
```

ここで、AngularやVue.jsなどを触ったことある人ならわかると思うんですが、

Reactには、配列の中身をループして表示するためのものがありません。

Angularでいう`ng-repeat`、Vueでいう`v-for`などです。

なので、配列にjsxのコンポーネントを追加してその配列をrenderするという方式がベターなようです。

他にも直接renderの中に、ループ文を書いてレンダリングする方法もあります。

では、この`LogItem`を実装していきましょう。

この`LogItem`には、削除や編集の機能を持たせないといけないのでTODOで、重要な部分の実装になります。

```
var React = require("react");
 
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
 
  /*
  * 	チェックする
  */
	_check: function(e){
		var id = e.target.id;
		if(id){
			this.props.updateAction(id,{
				isDone: !this.props.logs.isDone
			});
		}
	},
 
  /*
  *   削除
  */
	_delete: function(e){
		this.props.deleteAction(e.target.parentElement.id);
		return;
	},

  /*
  *   編集
  */
	_edit: function(e){
		var id = e.target.parentElement.id,
				_text = prompt("変更内容を記述してください",this.props.getInputDefaultValue(id))
		if(_text !== null){
			this.props.updateAction(id,{text: _text})
		}
		return;
	}
 
});
 
module.exports = LogItem;
```

ここまでで実装は終わりです。

Lv1よりも、実用的なもの（よくあるパターンではある）が出来たのではないでしょうか。

それぞれを今回はES5で書きましたが、是非ES6へ書き換えてみてください！