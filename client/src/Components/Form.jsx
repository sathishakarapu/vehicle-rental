import React, { useState, useEffect } from 'react';
import { TextField, RadioGroup, FormControlLabel, Radio, Button, Typography } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

const Form = () => {
    const [step, setStep] = useState(0);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [wheels, setWheels] = useState('');
    const [vehicleTypes, setVehicleTypes] = useState([]);
    const [vehicleType, setVehicleType] = useState('');
    const [vehicleModels, setVehicleModels] = useState([]);
    const [vehicleModel, setVehicleModel] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (wheels) {
            axios.get(`http://localhost:8080/types/${wheels}`).then((response) => {
                setVehicleTypes(response.data);
            }).catch(error => {
                console.error('Error fetching vehicle types:', error);
            });
        }
    }, [wheels]);

    useEffect(() => {
        if (vehicleType) {
            axios.get(`http://localhost:8080/models/${vehicleType}`).then((response) => {
                setVehicleModels(response.data);
                console.log('Vehicle models fetched:', response.data);
            }).catch(error => {
                console.error('Error fetching vehicle models:', error);
            });
        }
    }, [vehicleType]);

    const handleNext = () => {
        let currentErrors = {};

        if (step === 0) {
            if (!firstName) currentErrors.firstName = 'First name is required';
            if (!lastName) currentErrors.lastName = 'Last name is required';
        } else if (step === 1) {
            if (!wheels) currentErrors.wheels = 'Number of wheels is required';
        } else if (step === 2) {
            if (!vehicleType) currentErrors.vehicleType = 'Vehicle type is required';
        } else if (step === 3) {
            if (!vehicleModel) currentErrors.vehicleModel = 'Vehicle model is required';
        }

        if (Object.keys(currentErrors).length > 0) {
            setErrors(currentErrors);
        } else {
            setErrors({});
            setStep(step + 1);
        }
    };

    const handleBack = () => {
        if (step > 0) {
            setStep(step - 1);
        }
    };

    const handleSubmit = () => {
        let currentErrors = {};
        if (!startDate) currentErrors.startDate = 'Start date is required';
        if (!endDate) currentErrors.endDate = 'End date is required';

        if (Object.keys(currentErrors).length > 0) {
            setErrors(currentErrors);
        } else {
            const bookingData = {
                firstName,
                lastName,
                wheels,
                vehicleType,
                vehicleModel,
                startDate,
                endDate,
            };
            console.log(bookingData);
            axios.post('http://localhost:8080/book', bookingData)
                .then(response => {
                    alert('Booking successful');
                    setFirstName('');
                    setLastName('');
                    setWheels('');
                    setVehicleType('');
                    setVehicleModel('');
                    setStartDate(new Date());
                    setEndDate(new Date());
                    setErrors({});
                    setStep(0);
                })
                .catch(error => {
                    alert('Error booking vehicle');
                });
        }
    };

    const handleModelChange = (e) => {
        console.log(e.target.value);
        setVehicleModel(e.target.value);
    };

    return (
        <div>
            {step === 0 && (
                <div>
                    <TextField
                        label="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        error={!!errors.firstName}
                        helperText={errors.firstName}
                        style={{margin:"10px"}}
                    />
                    <TextField
                        label="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        error={!!errors.lastName}
                        helperText={errors.lastName}
                        style={{margin:"10px"}}
                    />
                    <Button onClick={handleNext} style={{margin:"10px"}}>Next</Button>
                </div>
            )}
            {step === 1 && (
                <div>
                    <RadioGroup value={wheels} onChange={(e) => setWheels(e.target.value)}>
                        <FormControlLabel value="2" control={<Radio />} label="2" style={{margin:"10px"}}/>
                        <FormControlLabel value="4" control={<Radio />} label="4" style={{margin:"10px"}}/>
                    </RadioGroup>
                    <Typography color="error">{errors.wheels}</Typography>
                    <Button onClick={handleBack} style={{margin:"10px"}}>Back</Button>
                    <Button onClick={handleNext} style={{margin:"10px"}}>Next</Button>
                </div>
            )}
            {step === 2 && (
                <div>
                    <RadioGroup value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}>
                        {vehicleTypes.map(({ type }) => (
                            <FormControlLabel key={type} value={type} control={<Radio />} label={type} style={{margin:"10px"}}/>
                        ))}
                    </RadioGroup>
                    <Typography color="error">{errors.vehicleType}</Typography>
                    <Button onClick={handleBack}>Back</Button>
                    <Button onClick={handleNext}>Next</Button>
                </div>
            )}
            {step === 3 && (
                <div>
                    <RadioGroup value={vehicleModel} onChange={handleModelChange}>
                        {vehicleModels.map((model) => (
                            <FormControlLabel key={model._id} value={model.model} control={<Radio />} label={model.model} style={{margin:"10px"}}/>
                        ))}
                    </RadioGroup>
                    <Typography color="error">{errors.vehicleModel}</Typography>
                    <Button onClick={handleBack}>Back</Button>
                    <Button onClick={handleNext}>Next</Button>
                </div>
            )}
            {step === 4 && (
                <div>
                    <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
                    <Typography color="error">{errors.startDate}</Typography>
                    <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
                    <Typography color="error">{errors.endDate}</Typography>
                    <Button onClick={handleBack} style={{margin:"10px"}}>Back</Button>
                    <Button onClick={handleSubmit} style={{margin:"10px"}}>Submit</Button>
                </div>
            )}
        </div>
    );
};

export default Form;