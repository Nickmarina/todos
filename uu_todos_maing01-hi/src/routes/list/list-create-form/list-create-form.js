//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent, useLsiValues, useState  } from "uu5g04-hooks";
import Lsi from './list-create-form-lsi';
import Config from "../config/config";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "ListCreateForm",
  nestingLevel: "bigBoxCollection",
  //@@viewOff:statics
};

const ListCreateForm = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    const { closeModal, handlerMap} = props;
    const [isLoading, setIsLoading]=useState(false)
    // const inputLsi = useLsiValues(Lsi)

    async function handleCreate(formData) {
      const { values, component } = formData;

      component.setPending();
      try{
        await handlerMap.create(values)
          component.getAlertBus().addAlert({
          content: <UU5.Common.Error content={<UU5.Bricks.Lsi lsi={Lsi.saveSuccess} />} />,
          colorSchema: "success",
        });
      }
      catch{
        component.getAlertBus().addAlert({
          content: <UU5.Common.Error content={<UU5.Bricks.Lsi lsi={Lsi.saveError} />} />,
          colorSchema: "danger",
        });
      }
      component.setReady();
      closeModal();
    }
    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    const className = Config.Css.css``;
    const attrs = UU5.Common.VisualComponent.getAttrs(props, className);
    const currentNestingLevel = UU5.Utils.NestingLevel.getNestingLevel(
      props,
      STATICS
    );

    return (
      <UU5.Forms.ContextForm
        onSave={handleCreate}
        onCancel={closeModal}
        progressIndicator={<UU5.Bricks.Loading />}
        disabled={isLoading}
      >
        <UU5.Forms.Text 
        label="Name"
        name="name"
        value=''
        />
      </UU5.Forms.ContextForm>
    );
    //@@viewOff:render
  },
});

//viewOn:helpers
const ListCreateHeader = () => {
  return (
    <UU5.Forms.ContextHeader
      content={<UU5.Bricks.Lsi lsi={Lsi.header} />}
      info={<UU5.Bricks.Lsi lsi={Lsi.info} params={[Config.TEST_TICKET_SET_STATE]} />}
    />
  );
};

const ListCreateControls = ({ isCreateForm }) => {
  return (
    <UU5.Forms.ContextControls
      buttonSubmitProps={{ content: <UU5.Bricks.Lsi lsi={Lsi.submit("Create")}/> }}
      buttonCancelProps={{ content: <UU5.Bricks.Lsi lsi={Lsi.cancel} /> }}
    />
  );
};
//viewOff:helpers

//viewOn:exports
export { ListCreateForm, ListCreateHeader, ListCreateControls };
export default  ListCreateForm;
//viewOff:exports