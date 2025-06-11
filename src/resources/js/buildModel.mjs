import { reactive, watch as vueWatch, toRef, isRef, readonly } from 'vue';
import { isEmpty, emptyOrValue, convertToBool } from 'knighttower/utility';

/**
 * Build reactive models for components from props, attrs, and data. Or just data alone.
 * @function buildModel
 * @param {Object} {props, attrs, exclude, data, watch}
 * @object {Object} props - Props object from the component
 * @object {Object} attrs - Attrs object from the component
 * @object {Array} exclude - Array of keys to exclude from the model
 * @object {Object} data - User defined data object to add to the model
 * @object {object} watch - prop key: callback function
 * @return {Object} Reactive Object
 */
const buildModel = (inputObject = {}) => {
    const { props = {}, attrs = {}, data = {}, exclude = [], watch = {} } = inputObject;
    delete inputObject.props;
    delete inputObject.attrs;
    delete inputObject.data;
    delete inputObject.exclude;
    delete inputObject.watch;

    const isVue = isEmpty(props) || isEmpty(attrs);
    const clientData = emptyOrValue(data, inputObject);

    const compAttrs = { class: null, style: null };
    const inputAttrs = { required: false, disabled: false, placeholder: null };
    const templateModel = Object.assign({ visible: true, inputValue: null }, inputAttrs, compAttrs);

    const inputObjectKeys = [...new Set([...Object.keys(props), ...Object.keys(attrs), ...Object.keys(clientData)])];
    const forbidden = [
        'name',
        'type',
        'value',
        'checked',
        'id',
        'selected',
        'input',
        'change',
        'options',
        'for',
        'props',
        'attrs',
    ];
    const remove = [...new Set([...(isVue ? [] : forbidden), ...exclude, ...Object.keys(compAttrs)])];
    const baseModel = Object.assign({}, templateModel);
    const inputBag = inputObjectKeys.filter((key) => !remove.includes(key));
    for (const key of inputBag) {
        if (!(key in baseModel)) baseModel[key] = null;
    }

    const Model = reactive(baseModel);
    const Static = {};
    const Attrs = {};

    for (const key in baseModel) {
        if (key in props) Model[key] = props[key];
        else if (key in attrs) Model[key] = attrs[key];
        else if (key in clientData) Model[key] = clientData[key];
    }

    for (const key of ['name', 'type', 'id', 'multiple', 'autofocus']) {
        if (key in attrs) {
            Static[key] = attrs[key];
            Attrs[key] = attrs[key];
        }
    }

    for (const key in templateModel) {
        if (!(key in Attrs) && key in attrs) {
            if (key in Model) {
                Model[key] = toRef(attrs, key);
                Attrs[key] = toRef(Model, key);
            } else {
                Attrs[key] = attrs[key];
            }
        }
    }

    if ('modelValue' in props || 'value' in attrs) {
        if ('value' in attrs && (typeof attrs.value === 'boolean' || emptyOrValue(attrs.value))) {
            Model.inputValue = attrs.value;
        }
        if (
            'modelValue' in clientData &&
            (typeof clientData.modelValue === 'boolean' || emptyOrValue(clientData.modelValue))
        ) {
            Model.inputValue = clientData.modelValue;
        }
        if ('modelValue' in props && (typeof props.modelValue === 'boolean' || emptyOrValue(props.modelValue))) {
            Model.inputValue = props.modelValue;
        }
    }

    if (inputBag.includes('type') && isVue) {
        let type = props.type ?? attrs.type;
        if (['checkbox', 'radio', 'switch'].includes(type)) {
            let checked = null;
            if ('checked' in attrs) checked = attrs.checked === 'undefined' ? true : attrs.checked;
            else if (props.checked) checked = props.checked;
            if (checked !== null) Model.inputValue = convertToBool(checked);
        }
    }

    const events = {};
    const on = (valToWatch, callback) => {
        if (!events[valToWatch]) {
            events[valToWatch] = [];
            setWatcher(valToWatch);
        }
        events[valToWatch].push(callback);
    };

    const setupWatcher = (key, source, model, modelKey, converter) => {
        if (key in source) {
            vueWatch(
                () => source[key],
                (newVal) => {
                    model[modelKey] = converter ? converter(newVal) : newVal;
                },
            );
        }
    };

    setupWatcher('modelValue', clientData, Model, 'inputValue');
    setupWatcher('modelValue', props, Model, 'inputValue');
    setupWatcher('options', props, Model, 'options');
    setupWatcher('checked', props, Model, 'inputValue', convertToBool);
    setupWatcher('checked', attrs, Model, 'inputValue', convertToBool);

    Object.keys(watch).forEach(setWatcher);
    function setWatcher(valToWatch) {
        if (inputBag.includes(valToWatch) || valToWatch === '*') {
            const watchCallback = (newVal, oldVal) => {
                watch[valToWatch]?.(newVal, oldVal);
                events[valToWatch]?.forEach((cb) => cb(newVal, oldVal));
            };
            if (valToWatch === '*') {
                vueWatch(() => Model, watchCallback, { deep: true });
            } else {
                vueWatch(() => Model[valToWatch], watchCallback);
            }
        }
    }

    return {
        Model,
        on,
        InputBag: inputBag,
        Static: readonly(Static),
        Attrs: new Proxy(Attrs, {
            get(target, prop) {
                if (prop in target) {
                    const val = target[prop];
                    return isRef(val) ? val.value : val;
                }
            },
        }),
    };
};

export { buildModel, buildModel as default };
