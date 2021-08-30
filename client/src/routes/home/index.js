import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { AgGridReact } from 'ag-grid-react';
import { AgGridColumn } from 'ag-grid-react/lib/agGridColumn';
import { Component } from 'preact';
import 'preact-material-components/Button/style.css';
import 'preact-material-components/Card/style.css';
import { connect } from 'react-redux';
import { APPS_FETCH_REQUESTED } from '../../redux/actions/appsActions';
import LabelCellEditor from '../../components/LabelCellEditor';
import style from './style';

@connect((store) => {
	return {
		apps: store,
	};
})
export default class Home extends Component {
	constructor(props) {
		super();
		this.props = props;
		console.log(this.props);
		this.props.dispatch({type: APPS_FETCH_REQUESTED});
		this.rowData = [{ name: "Toyota", url: "Celica", labels: "abc,def" }];

		this.frameworkCmp = {
			labelCellRenderer: LabelCellEditor
		}
	}

	onGridReady(params) {
		this.gridApi = params.api;
		this.gridColumnApi = params.columnApi;
		this.gridApi.sizeColumnsToFit();
	}

	render() {
		return (
			<div className="ag-theme-alpine" style="height:100%">

				<AgGridReact
					frameworkComponents={this.frameworkCmp}
					rowData={this.rowData}
					onGridReady={this.onGridReady}
				>
					<AgGridColumn headerName="Name" field="name"></AgGridColumn>
					<AgGridColumn headerName="Repo URL" field="url"></AgGridColumn>
					<AgGridColumn headerName="Labels" field="labels" autoHeight={true} editable={true} cellClass={style.myAgCell}
						cellEditorFramework={LabelCellEditor}></AgGridColumn>
				</AgGridReact>

			</div>);
	}
}
