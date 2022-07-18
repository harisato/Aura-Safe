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
                  <svg width="22" height="22" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M0.5 12C0.5 5.37258 5.87258 0 12.5 0V0C19.1274 0 24.5 5.37258 24.5 12V12C24.5 18.6274 19.1274 24 12.5 24V24C5.87258 24 0.5 18.6274 0.5 12V12Z"
                      fill="url(#paint0_linear_5834_14837)"
                    />
                    <path
                      d="M8.5 11.9999L11.1667 14.6666L16.5 9.33325"
                      stroke="#121212"
                      strokeWidth="2"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_5834_14837"
                        x1="0.500001"
                        y1="12"
                        x2="22.0944"
                        y2="19.2075"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#5EE6D0" />
                        <stop offset="0.515056" stopColor="#BFC6FF" />
                        <stop offset="1" stopColor="#FFBA69" />
                      </linearGradient>
                    </defs>
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
                <Row align="center" grow className={classes.controlStyle}>
                  <Col center="xs" xs={12}>
                    <Button onClick={onClickPreviousStep} size="small" className={classes.backButton} type="button">
                      {backButtonLabel}
                    </Button>
                    <div className={classes.borderNextButton}>
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

export type StepElementProps = {
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
