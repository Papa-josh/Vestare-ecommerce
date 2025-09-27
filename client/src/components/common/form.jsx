// STRUCRURE

import React from "react";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

// formControls - will receive form control from the parent component
// formData - we are going to manage each and every input value
// setFormData - will receive a set State method
function CommonForm({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled,
}) {
  function renderInputsByComponentType(getControlItem) {
    let element = null;
    const value = formData[getControlItem.name] || ""; //get the form data of username, email, password
    switch (getControlItem.componentType) {
      case "input":
        element = (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name} //or getControlItem.id
            type={getControlItem.type}
            value={value}
            onChange={(e) =>
              //
              // here we will save the data to setFormData
              setFormData({
                ...formData,
                [getControlItem.name]: e.target.value, //email: "test@example.com",
                // Key: "email", Value: "test@example.com"
              })
            }
          />
        );
        break;

      //this will take a value and onChange.
      case "select":
        element = (
          <Select
            onValueChange={(value) => {
              setFormData({ ...formData, [getControlItem.name]: value });
            }}
            value={value}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={getControlItem.placeholder}
              ></SelectValue>
            </SelectTrigger>
            <SelectContent>
              {getControlItem.options && getControlItem.options.length > 0
                ? getControlItem.options.map((optionItem) => (
                    <SelectItem key={optionItem.id} value={optionItem.id}>
                      {optionItem.label}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
        );
        break;

      case "textarea":
        element = (
          <Textarea
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.id}
            value={value}
            onChange={(e) =>
              //
              // here we will save the data to setFormData
              setFormData({
                ...formData,
                [getControlItem.name]: e.target.value, //email: "test@example.com",
                // Key: "email", Value: "test@example.com"
              })
            }
          />
        );
        break;

      default:
        element = (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name} //or getControlItem.id
            type={getControlItem.type}
            value={value}
            onChange={(e) =>
              //

              // here we will save the data to setFormData
              setFormData({
                ...formData,
                [getControlItem.name]: e.target.value, //email: "test@example.com",
                // Key: "email", Value: "test@example.com"
              })
            }
          />
        );
        break;
    }
    return element;
  }
  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-3">
        {formControls.map((controlItem) => (
          <div className="grid w-full gap-1.5" key={controlItem.name}>
            <Label className="mb-1">{controlItem.label}</Label>
            {renderInputsByComponentType(controlItem)}
          </div>
        ))}
      </div>
      <Button disabled={isBtnDisabled} type="submit" className="mt-2 w-full">
        {
          //check if there is a button text already provided or else we'll keep this as default
          buttonText || "Submit"
        }
      </Button>
    </form>
  );
}

export default CommonForm;
