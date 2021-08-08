import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function DropDown(props) {
  const classes = useStyles();

  const handleChange = (event) => {
    props.setField(event.target.value);
    props.setIsValid(event.target.value != null);
    if (event.target.value === "") {
      props.setField("");
      props.setIsValid("");
    }
  };

  let listItems;
  if (props.list.length >= 1) {
    listItems = props.list.map((item, index) => (
      <MenuItem value={item} key={index}>
        {item}
      </MenuItem>
    ));
    //TODO: else no items are available
  }

  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-helper-label">
          {props.role}
        </InputLabel>
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={props.field}
          onChange={handleChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {listItems}
        </Select>
        <FormHelperText>
          It is mandatory to select a {props.role}
        </FormHelperText>
      </FormControl>
    </div>
  );
}
