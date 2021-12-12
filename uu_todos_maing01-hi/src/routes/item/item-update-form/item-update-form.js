import UU5 from "uu5g04";
import { createVisualComponent, useLsiValues, useState  } from "uu5g04-hooks";
import Lsi from './item-update-form-lsi';
import Config from "../../list/config/config";

const STATICS = {
  displayName: Config.TAG + "ItemUpdateForm",
  nestingLevel: "bigBoxCollection",
};

const ItemUpdateForm = createVisualComponent({
  ...STATICS,

  render(props) {
    const { data, closeModal } = props;
    const [isLoading]=useState(false)

    async function handleUpdate(formData) {
      const { values, component } = formData;
    
      component.setPending();

      try{
        await data.handlerMap.update(values);
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
    const className = Config.Css.css``;
    const attrs = UU5.Common.VisualComponent.getAttrs(props, className);
    const currentNestingLevel = UU5.Utils.NestingLevel.getNestingLevel(
      props,
      STATICS
    );

    return (
      <UU5.Forms.ContextForm
        onSave={handleUpdate}
        onCancel={closeModal}
        progressIndicator={<UU5.Bricks.Loading />}
        disabled={isLoading}
      >
        <UU5.Forms.Text 
        label="Text"
        name="text"
        value={data?.data.text}
        />
      </UU5.Forms.ContextForm>
    );
  },
});
const ItemUpdateHeader = () => {
  return (
    <UU5.Forms.ContextHeader
      content={<UU5.Bricks.Lsi lsi={Lsi.header} />}
      info={<UU5.Bricks.Lsi lsi={Lsi.info} params={[Config.TEST_TICKET_SET_STATE]} />}
    />
  );
};

const ItemUpdateControls = () => {
  return (
    <UU5.Forms.ContextControls
      buttonSubmitProps={{ content: <UU5.Bricks.Lsi lsi={Lsi.submit("Update")} /> }}
      buttonCancelProps={{ content: <UU5.Bricks.Lsi lsi={Lsi.cancel} /> }}
    />
  );
};
export { ItemUpdateForm, ItemUpdateHeader, ItemUpdateControls };
export default  ItemUpdateForm;