var React = require("react")

var LogItem = require("./LogItem.jsx")

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

module.exports = LogBox