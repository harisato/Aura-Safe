import { ReactElement } from 'react'
import StepperMUI from '@material-ui/core/Stepper'
import StepMUI from '@material-ui/core/Step'
import StepContent from '@material-ui/core/StepContent'
import StepLabel from '@material-ui/core/StepLabel'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core'
import Hairline from 'src/components/layout/Hairline'
import Button from 'src/components/layout/Button'
import Col from 'src/components/layout/Col'
import Row from 'src/components/layout/Row'
import { StepperProvider, useStepper } from './stepperContext'
import { styles } from './styles'

type StepperProps = {
  children: ReactElement[]
  onFinish?: () => void
  disableNextButton?: boolean
  nextButtonType?: string
  testId?: string
}

function StepperComponent(): ReactElement {
  const {
    currentStep,
    setCurrentStep,
    steps,

    onClickPreviousStep,
    onClickNextStep,

    disableNextButton,
    nextButtonType,

    testId,
  } = useStepper()

  return (
    <StepperMUI data-testid={testId} activeStep={currentStep} orientation="vertical">
      {steps.map(function Step(step, index) {
        const isFirstStep = index === 0
        const isStepLabelClickable = currentStep > index
        const classes = useStyles({ isStepLabelClickable })
        function onClickLabel() {
          if (isStepLabelClickable) {
            setCurrentStep(index)
          }
        }

        const currentComponent = steps[index]

        const backButtonLabel = isFirstStep ? 'Cancel' : 'Back'
        const customNextButtonLabel = currentComponent.props.nextButtonLabel

        const nextButtonLabel = customNextButtonLabel || 'Next'

        return (
          <StepMUI key={step.props.label}>
            {isStepLabelClickable ? (
              <StepLabel
                onClick={onClickLabel}
                className={classes.stepLabel}
                icon={
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="22" height="22" rx="12" fill="#5EE6D0" />
                    <path
                      d="M8 11.9997L10.6667 14.6663L16 9.33301"
                      stroke="#0F0F0F"
                      strokeWidth="2"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
              >
                {step.props.label}
              </StepLabel>
            ) : (
              <StepLabel onClick={onClickLabel} className={classes.stepLabel}>
                {step.props.label}
              </StepLabel>
            )}
            <StepContent>
              <Paper className={classes.root} elevation={1}>
                {currentComponent}
                <Hairline />
                <Row grow className={classes.controlStyle}>
                  <Col center="md" className={classes.FotterForm} xs={12}>
                    <Button onClick={onClickPreviousStep} size="small" className={classes.backButton} type="button">
                      {backButtonLabel}
                    </Button>
                    <div
                      className={
                        disableNextButton || step.props.disableNextButton
                          ? classes.borderNextButtonDisable
                          : classes.borderNextButton
                      }
                    >
                      <Button
                        onClick={onClickNextStep}
                        color="primary"
                        type={nextButtonType || 'button'}
                        disabled={disableNextButton || step.props.disableNextButton}
                        size="small"
                        className={classes.nextButton}
                        variant="contained"
                      >
                        {nextButtonLabel}
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Paper>
            </StepContent>
          </StepMUI>
        )
      })}
    </StepperMUI>
  )
}

export default function Stepper(props: StepperProps): ReactElement {
  return (
    <StepperProvider stepsComponents={props.children} {...props}>
      <StepperComponent />
    </StepperProvider>
  )
}

const useStyles = makeStyles((theme) => styles(theme))
type StepElementProps = {
  label: string
  children: JSX.Element
  nextButtonLabel?: string
  nextButtonType?: string
  disableNextButton?: boolean
}

export type StepElementType = (props: StepElementProps) => ReactElement

export function StepElement({ children }: StepElementProps): ReactElement {
  return children
}
