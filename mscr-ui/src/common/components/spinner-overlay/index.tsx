import { RotatingLines } from 'react-loader-spinner';

export enum SpinnerType {
  SchemaRegistrationModal = 'schema-registration-modal',
  CrosswalkRegistrationModal = 'crosswalk-registration-modal',
  CrosswalkCreationModal = 'crosswalk-creation-modal',
}

export const delay = async (ms) => {
  return new Promise((resolve) =>
    setTimeout(resolve, ms));
};

export default function SpinnerOverlay(props: {
  type: SpinnerType;
  animationVisible: boolean;
}) {

  const classes = `modal-busy-overlay ${props.type}`;
  return(<>
    {props.animationVisible && (
      <div className={classes}>
        <RotatingLines
          visible={true}
          height="190"
          width="190"
          color="blue"
          strokeWidth="4"
          animationDuration="1"
          ariaLabel="loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>)}
  </>);
}