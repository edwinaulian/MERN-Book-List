import React, { Component } from 'react';
import PostApiService from './component/common/services/PostApiService';
import { confirmPopup } from 'primereact/confirmpopup'; // To use confirmPopup method
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import moment from 'moment/moment.js';

import './table.css';

const TableHeader = () => {
    return (
        <thead>
            <tr>
                <th className="row-headers">Title</th>
                <th className="row-headers">Description</th>
                <th className="row-headers">Date</th>
                <th className="row-headers">Action</th>
            </tr>
        </thead>
    )
}

const TableBody = props => (
    <tr>
        <td className="row-values">{props.characterData.title}</td>
        <td className="row-values">{props.characterData.description}</td>
        <td className="row-values">
            {moment(props.characterData.date).calendar()}
        </td>
        <td className="row-values">
            <button type="button" onClick={() => { props.confrimDeletedData(props.characterData._id) }} className="bi bi-trash-fill"></button>
            &nbsp;&nbsp;
            <button type="button" onClick={() => { props.updatedDataBook(props.characterData._id, 'displayBasic', 'top', props.characterData.title) }} className="bi bi-pencil-square"></button>
        </td>
    </tr>
)

class Table extends Component {
    id;
    dinamisTitle;

    constructor(props) {
        super(props);
        this.getAllData();
        this.deletedDataBook = this.deletedDataBook.bind(this);
        this.updatedDataBook = this.updatedDataBook.bind(this);
        this.confrimDeletedData = this.confrimDeletedData.bind(this);
        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.onChangeTitleAdd = this.onChangeTitleAdd.bind(this);
        this.onChangeDescriptionAdd = this.onChangeDescriptionAdd.bind(this);
        this.addDataBook = this.addDataBook.bind(this);
        this.state = {
            characterData: [], displayBasic: false, showAddFromData: false, position: 'center', title: '', description: ''
        };
        this.onHide = this.onHide.bind(this);
        this.onSave = this.onSave.bind(this);

        this.onHideAddData = this.onHideAddData.bind(this);
        this.onShowAddData = this.onShowAddData.bind(this);
    }

    getAllData() {
        PostApiService.getAll().then(response => {
            const data = response.data;
            this.setState({ characterData: data.data });
        }).catch(e => {
            console.log(e);
        });
    }

    confrimDeletedData(event) {
        confirmPopup({
            target: event.currentTarget,
            message: 'Are you sure you want to proceed deleted?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => this.deletedDataBook(event),
            reject: () => { }
        });
    }

    deletedDataBook(id) {
        PostApiService.remove(id).then(response => {
            console.log('response', response);
            this.toast.show({ severity: 'info', summary: 'Confirmed', detail: 'You deleted this data', life: 3000 });
        });
        this.setState({
            characterData: this.state.characterData.filter(data => data._id !== id),
        })
    }

    updatedDataBook(id, name, position, title) {
        console.log('updated', id, name, position);
        this.id = id;
        this.dinamisTitle = 'Edit data Book : ' + title;
        let state = {
            [`${name}`]: true
        };

        if (position) {
            state = {
                ...state,
                position
            }
        }

        this.setState(state);
    }

    listDataTableBook() {
        return this.state.characterData.map(characterData => {
            return <TableBody characterData={characterData} updatedDataBook={this.updatedDataBook} confrimDeletedData={this.confrimDeletedData} key={characterData._id} />
        })
    }

    onHide(name) {
        this.setState({
            [`${name}`]: false
        });
    }

    onHideAddData(name) {
        this.setState({
            [`${name}`]: false
        });
    }

    onSave(name) {
        const payload = {
            title: this.state.title,
        }
        PostApiService.update(this.id, payload).then(response =>
            console.log('response', response),
            this.setState({
                [`${name}`]: false,
            }),
            window.location.reload(),
        );
    }

    renderFooter(name) {
        return (
            <div>
                <Button label="Cancel" icon="pi pi-times" onClick={() => this.onHide(name)} className="p-button-text" />
                <Button label="Save" icon="pi pi-check" onClick={() => this.onSave(name)} autoFocus />
            </div>
        );
    }

    onChangeTitle(e) {
        this.setState({ title: e.target.value });
    }

    onChangeTitleAdd(e) {
        this.setState({ title: e.target.value });
    }

    onChangeDescriptionAdd(e) {
        this.setState({ description: e.target.value });
    }

    addDataBook(name, position) {
        console.log('showAddFromData', name, position);
        let state = {
            [`${name}`]: true
        };

        if (position) {
            state = {
                ...state,
                position
            }
        }

        this.setState(state);
    }

    onShowAddData(name) {
        const payload = {
            title: this.state.title,
            description: this.state.description
        }
        PostApiService.create(payload).then(response =>
            console.log('response', response),
            this.setState({
                [`${name}`]: false,
            }),
            window.location.reload(),
        );
    }

    renderFooterAddData(name) {
        return (
            <div>
                <Button label="Cancel" icon="pi pi-times" onClick={() => this.onHideAddData(name)} className="p-button-text" />
                <Button label="Add" icon="pi pi-check" onClick={() => this.onShowAddData(name)} autoFocus />
            </div>
        );
    }

    render() {
        return (
            <div>
                <div>
                    <Button label="Add Data Book" icon="pi pi-add" onClick={() => this.addDataBook('showAddFromData', 'top')} className="" />
                    <Dialog header="Add new data Book" visible={this.state.showAddFromData} style={{ width: '50vw' }} footer={this.renderFooterAddData('showAddFromData')} onHide={() => this.onHideAddData('showAddFromData')}>
                        <div>
                            <form onSubmit={this.renderFooterAddData}>
                                <div className="form-group">
                                    <label>Title :</label>
                                    <input type="text"
                                        required
                                        className="form-control"
                                        value={this.state.titleadd}
                                        onChange={this.onChangeTitleAdd}
                                    />
                                    <label>Description :</label>
                                    <input type="text"
                                        required
                                        className="form-control"
                                        value={this.state.description}
                                        onChange={this.onChangeDescriptionAdd}
                                    />
                                </div>
                            </form>
                        </div>
                    </Dialog>
                </div>
                <div>
                    <Toast ref={(el) => this.toast = el} />
                </div>
                <div>
                    <Dialog header={this.dinamisTitle} visible={this.state.displayBasic} style={{ width: '50vw' }} footer={this.renderFooter('displayBasic')} onHide={() => this.onHide('displayBasic')}>
                        <div>
                            <form onSubmit={this.renderFooter}>
                                <div className="form-group">
                                    <label>Title :</label>
                                    <input type="text"
                                        required
                                        className="form-control"
                                        value={this.state.title}
                                        onChange={this.onChangeTitle}
                                    />
                                </div>
                            </form>
                        </div>
                    </Dialog>
                </div>
                <div>
                    <table>
                        <TableHeader />
                        <tbody>
                            {this.listDataTableBook()}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default Table