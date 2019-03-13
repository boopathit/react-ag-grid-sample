import React, { Component } from "react";
import { connect } from "react-redux";

import { MuiThemeProvider } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";

import theme from "../../themes/my-theme";
import "./App.css";

const styles = {
  root: {
    flexGrow: 1
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columnDefs: [
        {
          headerName: "list_name",
          field: "list_name"
        },
        {
          headerName: "display_name",
          field: "display_name"
        },
        {
          headerName: "rank",
          field: "rank"
        }
      ]
    };
  }

  // static getDerivedStateFromProps() {}
  componentDidUpdate() {
    this.props.onRequestDog();
  }

  getDataSource() {
    let data = this.props.dog;
    return {
      getRows: params => {
        if (data) {
          var rowsThisPage = data.slice(params.startRow, params.endRow);
          var lastRow = -1;
          if (data.length <= params.endRow) {
            lastRow = data.length;
          }
          params.successCallback(rowsThisPage, lastRow);
        } else {
          this.setState({ rowParam: params });
        }
      }
    };
  }
  onGridReady = params => {
    this.gridApi = params.api;
    params.api.setDatasource(this.getDataSource());
    params.api.sizeColumnsToFit();
  };
  render() {
    const { classes } = this.props;
    return (
      <MuiThemeProvider theme={theme}>
        <div className={classes.root}>
          <AppBar position="static">
            <Toolbar>
              <IconButton
                className={classes.menuButton}
                color="inherit"
                aria-label="Menu"
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" color="inherit" className={classes.grow}>
                News
              </Typography>
              <Button color="inherit">Login</Button>
            </Toolbar>
          </AppBar>
          <div
            className="ag-theme-balham"
            style={{
              height: "500px",
              width: "600px"
            }}
          >
            <AgGridReact
              columnDefs={this.state.columnDefs}
              onGridReady={params => this.onGridReady(params)}
              rowModelType="serverSide"
            />
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = state => {
  return {
    fetching: state.fetching,
    dog: state.dog,
    error: state.error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onRequestDog: () => dispatch({ type: "API_CALL_REQUEST" })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(App));
