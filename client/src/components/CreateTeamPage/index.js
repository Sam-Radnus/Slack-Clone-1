import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { teamAction } from "@/actions";
import { NavBar, InlineError } from "../common";
import { validateForm } from "../../utils";
import CreateTeamForm from "./CreateTeamForm";
import { errorSelector, teamSelector } from "@/reducers/selectors";

class CreateTeamPage extends React.Component {
  state = {
    name: "",
    about: "",
    clientErrors: {}
  };

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };

  handleSubmit = () => {
    // validate user's login info on client side
    const clientErrors = validateForm.createTeam(this.state);
    this.setState({ clientErrors });

    // proceed to send data to server if there's no error
    if (Object.keys(clientErrors).length === 0) {
      const { createTeam, currentTeam, history } = this.props;
      const { name, about } = this.state;
      createTeam({ name, about });
      history.push(`/`);
    }
  };

  render() {
    const { clientErrors, name, about } = this.state;
    const { error } = this.props;

    return (
      <React.Fragment>
        <NavBar />
        <main className="create-team-page">
          <CreateTeamForm
            clientErrors={clientErrors}
            name={name}
            about={about}
            handleChange={this.handleChange}
            handleSubmit={this.handleSubmit}
          />
          {error && <InlineError text={error} />}
        </main>
      </React.Fragment>
    );
  }
}

const stateToProps = state => ({
  error: errorSelector.getError(state),
  currentTeam: teamSelector.getCurrentTeam(state)
});

const dispatchToProps = dispatch => ({
  createTeam: teamFormInfo => {
    dispatch(teamAction.createTeam(teamFormInfo));
  }
});
export default connect(
  stateToProps,
  dispatchToProps
)(CreateTeamPage);
