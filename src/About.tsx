

import React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';


interface IForm2 {
    firstName:  string
    lastName:   string
    changed:    Date | null
    gender:     string
    country:    string
    hobby:      string
}

export default function  About() {

    const initialValues: IForm2 = {
        firstName: "",
        lastName: "",
        gender: "male",
        country: "Canada",
        hobby: "",
        changed: null,
    };

    const hobbies = ["Writing", "Dance", "Painting", "Video Game"];

    const [hobbiesOn, sethobbiesOn] = React.useState([true, false, false, false]);
    const [changedDt, setChangedDt] = React.useState<Date | null>(null);
    const [formValues, setFormValues] = React.useState(initialValues);

    const checkHobby = (i: number) => {
        const newHobbiesOn = [...hobbiesOn];
        newHobbiesOn[i] = !newHobbiesOn[i];
        sethobbiesOn(newHobbiesOn);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target; // does not work for Checkbox !!  if (event.target.checked)
        setFormValues((prevFormValues) => (
            {
                ...prevFormValues,
                [name]: value,
            }));
    };

    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        const { name, value } = event.target;
        setFormValues((prevFormValues) => (
            {
                ...prevFormValues,
                [name]: value,
            }));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        formValues.changed = changedDt;
  
        const ah = [];
        for (let i = 0; i < hobbiesOn.length; i++)
            if (hobbiesOn[i])
                ah.push(hobbies[i]);
        formValues.hobby = ah.join(",");

        console.log(formValues);
        alert(JSON.stringify(formValues));
    };

    const handleClear = (_ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setFormValues(initialValues);
        setChangedDt(initialValues.changed);
        sethobbiesOn( [true, false, false, false]);
    };

    const validateForm = () => {
        if (formValues.firstName.length < 1) return false;
        if (formValues.lastName.length < 1) return false;
        return true;
    }

    return (
        <>
            <h4>Material ui About - form 2</h4>
            <Box>

                <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>

                        <Box my={2}>
                            <TextField
                                id="firstName"
                                name="firstName"
                                label="First name"
                                type="text"
                                value={formValues.firstName}
                                onChange={handleInputChange}
                            />
                        </Box>
                        <Box my={2}>
                            <TextField
                                id="lastName"
                                name="lastName"
                                label="Last name"
                                type="text"
                                value={formValues.lastName}
                                onChange={handleInputChange}
                            />
                        </Box>
                        <Box my={4}>
                            <FormControl>
                                <FormLabel>Gender</FormLabel>
                                <RadioGroup
                                    name="gender"
                                    value={formValues.gender}
                                    onChange={handleInputChange}
                                    row
                                >
                                    <FormControlLabel
                                        key="male"
                                        value="male"
                                        control={<Radio size="small" />}
                                        label="Male"
                                    />
                                    <FormControlLabel
                                        key="female"
                                        value="female"
                                        control={<Radio size="small" />}
                                        label="Female"
                                    />
                                    <FormControlLabel
                                        key="other"
                                        value="other"
                                        control={<Radio size="small" />}
                                        label="Other"
                                    />
                                </RadioGroup>
                            </FormControl>
                        </Box>

                        <Box my={4}>
                            <FormControl>
                                <FormLabel>Country</FormLabel>
                                <Select
                                    name="country"
                                    value={formValues.country}
                                    onChange={handleSelectChange}
                                >
                                    <MenuItem key="canada" value="Canada">
                                        Canada
                                    </MenuItem>
                                    <MenuItem key="japan" value="Japan">
                                        Japan
                                    </MenuItem>
                                    <MenuItem key="germany " value="Germany">
                                        Germany
                                    </MenuItem>
                                    <MenuItem key="switzerland " value="Switzerland">
                                        Switzerland
                                    </MenuItem>
                                    <MenuItem key="australia " value="Australia">
                                        Australia
                                    </MenuItem>
                                    <MenuItem key="united_states " value="United States">
                                        United States
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        <Box my={4}>
                            <FormLabel>Hobby</FormLabel>
                            <FormGroup>
                                {hobbies.map((hs, idx) => <FormControlLabel key={idx} control={<Checkbox name="hobby" 
                                    checked={hobbiesOn[idx]} onChange={() => checkHobby(idx)} />} label={hs} /> )}
                            </FormGroup>
                        </Box>


                        <Box sx={{ width: 200 }}>
                            <DatePicker
                                label="Changed Date"
                                value={changedDt}
                                format="dd-MM-yyyy"
                                onChange={(newValue: Date | null) => setChangedDt(newValue)}
                            />
                        </Box>

                        <Box my={6}>
                            <Button variant="contained" color="primary" type="submit" disabled={!validateForm()} style={{
                                margin: "5px"
                            }}> Submit</Button>

                            <Button variant="contained" color="secondary" onClick={handleClear}> Reset</Button>
                        </Box>

                    </Stack>
                </form>

                <Box my={4}>
                    <Link color="primary" component={RouterLink} to="/home">Go Home</Link>
                </Box>
            </Box>
        </>
    )
}
