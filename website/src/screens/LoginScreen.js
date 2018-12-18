import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import { withRouter } from 'react-router-dom';

class LoginScreen extends Component {
    constructor(props){
        super(props);

        this.state = {
            email: "",
            password: "",
            showPassword: false,
        }
    }

    handleChange = name => event => {
      this.setState({
        [name]: event.target.value,
      });
    };

    handleClickShowPassword = () => {
      this.setState(state => ({ showPassword: !state.showPassword }));
    };

    render() {
        return (
            <div className="card-center">
                <Card>
                    <CardContent classes={{ root: "card-content" }} className="text-center p-15">
                        <Typography variant="h3" color="inherit">
                            <span role="img" aria-label="icon">⚽️</span> Free Soccer <span role="img" aria-label="icon">⚽️</span>
                        </Typography>
                        <br /><br />
                        <Grid container spacing={24}>
                            <Grid item xs={12}>
                                <TextField
                                    id="outlined-email"
                                    label="Email"
                                    type="email"
                                    autoComplete="email"
                                    className="input-block"
                                    value={this.state.email}
                                    onChange={this.handleChange('email')}
                                    margin="normal"
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id="outlined-password"
                                    label="Password"
                                    type={this.state.showPassword ? 'text' : 'password'}
                                    className="input-block"
                                    value={this.state.password}
                                    onChange={this.handleChange('password')}
                                    margin="normal"
                                    variant="outlined"
                                    InputProps= {{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="Toggle password visibility"
                                                    onClick={this.handleClickShowPassword}
                                                >
                                                    {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                    <CardActions  classes={{ root: "card-actions" }}>
                        <Button className="button-block" variant="contained" color="primary">
                            Login
                        </Button>
                    </CardActions>
                </Card>
            </div>
        );
    }
}

export default withRouter(LoginScreen);