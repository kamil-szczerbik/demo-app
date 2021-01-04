import React, { Component } from 'react';
import formStyle from '../../css/form.module.css';

class AlertPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: ''
        };
        this.handleInput = this.handleInput.bind(this);
    }

    handleInput(e) {
        const newPassword = e.target.value;
        this.setState({ password: newPassword });
    }

    render() {
        return (
            <div className={formStyle.divFixed}>
                <div className={formStyle.divForm}>
                    <form className={formStyle.form}>
                        <label htmlFor="password">Podaj hasło:</label><br />
                        <input
                            className={formStyle.input}
                            type="password"
                            id="password"
                            name="password"
                            value={this.state.password}
                            onChange={this.handleInput}
                        />
                        <span className={formStyle.error}>{this.props.error}</span>

                        <input className={formStyle.submit} type="button" value="Wejdź"  onClick={() => this.props.checkPassword(this.state.password)}/>
                        <input className={formStyle.cancel} type="button" value="Anuluj" onClick={this.props.cancel} />
                    </form>
                </div>
            </div>
        );
    }
}

export default AlertPassword;