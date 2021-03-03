import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createExecution, deleteExecution, getExecutions, patchExecution } from '../api/executions-api'
import Auth from '../auth/Auth'
import { Execution } from '../types/Execution'

interface ExecutionsProps {
  auth: Auth
  history: History
}

interface ExecutionsState {
  executions: Execution[]
  newExecutionName: string
  loadingExecutions: boolean
}

export class Executions extends React.PureComponent<ExecutionsProps, ExecutionsState> {
  state: ExecutionsState = {
    executions: [],
    newExecutionName: '',
    loadingExecutions: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newExecutionName: event.target.value })
  }

  onEditButtonClick = (executionId: string) => {
    this.props.history.push(`/executions/${executionId}/edit`)
  }

  onExecutionCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const dueDate = this.calculateDueDate()
      const newExecution = await createExecution(this.props.auth.getIdToken(), {
        name: this.state.newExecutionName,
        dueDate
      })
      this.setState({
        executions: [...this.state.executions, newExecution],
        newExecutionName: ''
      })
    } catch {
      alert('Execution creation failed')
    }
  }

  onExecutionDelete = async (executionId: string) => {
    try {
      await deleteExecution(this.props.auth.getIdToken(), executionId)
      this.setState({
        executions: this.state.executions.filter(Execution => Execution.executionId != executionId)
      })
    } catch {
      alert('Execution deletion failed')
    }
  }

  onExecutionCheck = async (pos: number) => {
    try {
      const Execution = this.state.executions[pos]
      await patchExecution(this.props.auth.getIdToken(), Execution.executionId, {
        name: Execution.name,
        dueDate: Execution.dueDate,
        done: !Execution.done
      })
      this.setState({
        executions: update(this.state.executions, {
          [pos]: { done: { $set: !Execution.done } }
        })
      })
    } catch {
      alert('Execution deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const executions = await getExecutions(this.props.auth.getIdToken())
      this.setState({
        executions,
        loadingExecutions: false
      })
    } catch (e) {
      alert(`Failed to fetch Executions: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Executions</Header>

        {this.rendercreateExecutionInput()}

        {this.renderExecutions()}
      </div>
    )
  }

  rendercreateExecutionInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'New execution',
              onClick: this.onExecutionCreate
            }}
            fluid
            actionPosition="left"
            placeholder="Automated Suite execution # ...."
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderExecutions() {
    if (this.state.loadingExecutions) {
      return this.renderLoading()
    }

    return this.renderExecutionsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Executions
        </Loader>
      </Grid.Row>
    )
  }

  renderExecutionsList() {
    return (
      <Grid padded>
        {this.state.executions.map((executions, pos) => {
          return (
            <Grid.Row key={executions.executionId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onExecutionCheck(pos)}
                  checked={executions.done}
                />
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {executions.name}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {executions.dueDate}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(executions.executionId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onExecutionDelete(executions.executionId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {executions.attachmentUrl && (
                <Image src={executions.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
