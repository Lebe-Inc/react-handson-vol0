# react-handson-vol0

## 教材内容

ブロックを押すと、コインが飛び上がる。

stateで自分自身の状況を判断して、連続でクリックされてもバグらないように。

## ハンズオン

### 1. app.jsの作成

まずは`javascripts/app.js`を編集します。空のファイルが追加されてます。

これはReactがアプリを起動するために一番最初に読み込まれるコードです。

```js
var React = require("react");
var ReactDOM = require("react-dom");

// 後で作るApp.jsxをここで呼び込んでおく
var App = require("./components/App.jsx");

// ReactDOMのrenderメソッドでレンダリング
ReactDOM.render(
	<App/>,
	document.getElementById("react")
)
```

### 2. App.jsxの作成

次に`components/App.jsx`を作ります。

```js
var React = require("react");

var App = React.createClass({

	render: function(){
		return(
			<div>
				<h1>Hello React</h1>
			</div>
		)
	}
})

module.exports = App;
```

```module.exports = App;```の部分を忘れないように注意して下さい。

### 3. npm start

ターミナルに戻って、コンパイルを実行します。

```
$ npm start
```

最初の一回は少し時間がかかります。

ここまで作成したら、ブラウザでindex.htmlを開いてみましょう。

「Hello React」と表示されていればOKです。

編集 -> 自動ビルド -> ブラウザで確認の流れで開発を進めます。

### 4. Block、Coinの作成

``component/Block.jsx``、``component/Coin.jsx``を作成していきます。


```js
var React = require("react");

var Block = React.createClass({

	render: function(){
		return(
			<div>
				<p>This is Block</h1>
			</div>
		)
	}
})

module.exports = Block;
```


```js
var React = require("react");

var Coin = React.createClass({

	render: function(){
		return(
			<div>
				<p>This is Coin</h1>
			</div>
		)
	}
})

module.exports = Coin;
```


### 5. Block、Coinの読み込み

先ほど作成したApp.jsxを編集して、Block、Coinを読み込んでいきます。

```js
var React = require("react");
var Block = require("./Block.jsx");
var Coin = require("./Coin.jsx");

var App = React.createClass({

	render: function(){
		return(
			<div>
				<h1>Hello React</h1>
				<Coin />
				<Block />
			</div>
		)
	}
})

module.exports = App;
```

ここまで出来たら、ブラウザで確認して行きましょう。


## 実装開始

次に`components/App.jsx`を作ります。

React.createClass()を使い、コンポーネントを作ります。

ここに出てくるものは、

- getInitialState - stateの初期化。
- render - HTMLを記述します。
- _？？？ - 自作のメソッドを記述します。（これは習慣なので仕様とかではありません。）


```js
var React = require("react");

// 後で読み込みます
var Block = require("./Block.jsx")
var Coin = require("./Coin.jsx")

var App = React.createClass({

	getInitialState: function(){
		return{
			coinClass: "coin img"
		}
	},

	render: function(){
		return(
			<div>
				<Coin
					coinClass={this.state.coinClass}
				/>
				<Block
					classChange={this._classChange}
				/>
			</div>
		)
	},

	_classChange: function(){

		var self = this;
		this.setState({ coinClass: "coin img animating" });

		setTimeout(function(){
			self.setState({ coinClass: "coin img" })
		},800);

	}

})

module.exports = App;
```

これで親部分のコンポーネントを作ることはできました。

Reactでは、自分自身の状態を保つのに`state`を使います。

App.jsxでは、`coinClass`という`state`を持っています。これは、coinに与えるクラスになります。

Blockが押されたときにclassを変えたいので、`_classChange`をブロックに渡してしまいましょう。

肝心な`coinClass`のstateをCoinコンポーネントに渡し忘れないようにしましょう。

`this.setState`は、stateをアップデートするためのものです。setStateを行うと、仮想DOMにより実際のDOMとの差分だけ再レンダリングされます。

  

次は、この２つの子コンポーネントを作っていきましょう。

Blockコンポーネントを作っていきます。

```js
var React = require("react");

var count = 0,
		MAX_COUNT = 10; // 10回叩くと、コインが出なくなるようにします。

var Block = React.createClass({

	getInitialState: function(){
		return{
			isAnimating: false
		}
	},

	render: function(){
		return(
			<div className="img block" onClick={this._onClick}>
				<img ref="block_image" src="images/block.png"/>
			</div>
		)
	},

	_onClick: function(){

		if(this.state.isAnimating) return; // アニメーション中のclickを無視します。

		if(count < MAX_COUNT){

			var self = this;

			this.props.classChange();
			this.setState({ isAnimating: true })
			setTimeout(function(){
				self.setState({ isAnimating: false })
			},800);
			count+=1;

		}else{

			this.refs.block_image.src = "images/block_close.png";
			alert("コインはもう出ません")

		}
	}

})

module.exports = Block;
```

これでBlockができあがりました。

ここで肝心なのは`props`です。

`state`に対して、親から子へと送られるものは`props`というところから参照します。

先ほど`App.jsx`で、`_classChange`を`classChange`としてBlockに渡していました。

この`classChange`を参照するには、`this.props.classChange`となります。

Blockでは、`_onClick`というメソッドがあります。

ブロックをクリックすると`_onClick`が実行されます。その中で`this.props.classChange`を実行することで

`App.jsx`の`_classChange`を実行し、`coinClass`を書き換えることができます。


最後に`Coin.jsx`を見てみましょう。

```js
var React = require("react");

var Coin = React.createClass({

	render: function(){

		return(
			<div className={this.props.coinClass}>
				<img src="images/coin.png" />
			</div>
		)

	}

})

module.exports = Coin;
```

Coinは、`App.jsx`から受け取った値を自分自身に適応させればいいだけなので、

`className={this.props.coinClass}`となります。

ここまでで、Lv1のアプリは作ることができました。

`index.html`を見て、ちゃんと動くか確認しましょう！