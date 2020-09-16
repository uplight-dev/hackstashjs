import { h, Component } from 'preact';
import Card from 'preact-material-components/Card';
import 'preact-material-components/Card/style.css';
import 'preact-material-components/Button/style.css';
import style from './style';
import { AgGridReact } from 'ag-grid-react';
import { AgGridColumn } from 'ag-grid-react/lib/agGridColumn';
import useState from 'react';

function Home() {

	const [rowData, setRowData] = useState([
		{make: "Toyota", model: "Celica", price: 35000},
		{make: "Ford", model: "Mondeo", price: 32000},
		{make: "Porsche", model: "Boxter", price: 72000}
	]);

	return (
		<div>
		<AgGridReact
			rowData={rowData}>
			<AgGridColumn field="make"></AgGridColumn>
			<AgGridColumn field="model"></AgGridColumn>
			<AgGridColumn field="price"></AgGridColumn>
		</AgGridReact>
		</div>
	);
}

export default Home;