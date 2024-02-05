import * as React from 'react';
import styles from './FormQuiz.module.scss';
import { useState, useEffect } from 'react';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { TextField } from '@fluentui/react/lib/TextField';
import { Dropdown, IDropdownOption, IDropdownStyles } from '@fluentui/react/lib/Dropdown';
import { DefaultButton } from '@fluentui/react/lib/Button';
import spPostData from '../services/SPServiceApi';
import { getDateApi, postDataApi } from '../services/TimeIoServiceApi';
import { ResultScreen } from './ResultScreen';
import { mergeStyles } from '@fluentui/react/lib/Styling';
import loader from '../assets/Spin-1s-200px.gif';

const FormQuiz = () => {
    const [formData, setFormData] = useState({
        nameField: '',
        emailField: '',
        countryField: '',
        textField: '',
        hoursField: '',
        minutesField: '',
        selectField: null,
        checkboxField: false,
        multipleSelectField: []
    });

    let validateAnswers: boolean[] = [];

    const [formScreen, setFormScreen] = useState<string>("FormScreen");
    const [loadingScreen, setLoadingScreen] = useState<boolean>(true);

    const dropdownOptions: IDropdownOption[] = [
        { key: 'Tuesday', text: 'Tuesday' },
        { key: 'Friday', text: 'Friday' },
        { key: 'Saturday', text: 'Saturday' },
        { key: 'Monday', text: 'Monday' },
    ];

    const dropdownOptionsCountries: IDropdownOption[] = [
        { key: 'Europe/Paris', text: 'Paris' },
        { key: 'Europe/Lisbon', text: 'Lisbon' },
        { key: 'Europe/Dublin', text: 'Dublin' },
        { key: 'Europe/Madrid', text: 'Madrid' },
    ];

    const handleInputChange = (e: any, newValue: any) => {
        let formattedValue = '';
        if (e.target.name == "textField") {
            formattedValue = newValue.charAt(0).toUpperCase() + newValue.slice(1).toLowerCase();
            console.log('Formatted value:', formattedValue)
        }

        setFormData({
            ...formData,
            [e.target.name]: formattedValue === '' ? newValue : formattedValue
        });
    };


    const handleInputChange2 = (e: any, newValue: any) => {
        setFormData({
            ...formData,
            selectField: newValue,
        });
    };

    const handleMultipleSelectChange = (event: any, item: any) => {
        const selectedOptions = item.selected ? [...formData.multipleSelectField, item.key] : formData.multipleSelectField.filter(option => option !== item.key);
        setFormData({
            ...formData,
            multipleSelectField: selectedOptions,
        });
    };

    const handleHourChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        // Validate that the entered value is a number between 0 and 23
        const hour = newValue ? parseInt(newValue, 10) : 0;
        if (!isNaN(hour) && hour >= 0 && hour <= 23) {
            setFormData({
                ...formData,
                hoursField: newValue || '',
            });
        }
    };

    const handleMinuteChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        // Validate that the entered value is a number between 0 and 59
        const minute = newValue ? parseInt(newValue, 10) : 0;
        if (!isNaN(minute) && minute >= 0 && minute <= 59) {
            setFormData({
                ...formData,
                minutesField: newValue || '',
            });
        }
    };


    const handleSubmit = async (e: any) => {
        e.preventDefault();

        setLoadingScreen(true); // Set loadingScreen to true (show the loader
        // Handle form submission logic here
        // Validation: Check if any of the required fields is empty
        const cityQuestion01 = "Europe/" + formData.textField;
        console.log("CityQuestion01: " + cityQuestion01);
        const test01 = await postDataApi('Europe/Paris', cityQuestion01);
        console.log("Test01: " + test01);
        console.log(test01.conversionResult.hour == 11 && test01.conversionResult.minute);
        test01.conversionResult.hour == 11 && test01.conversionResult.minute == 0 ? validateAnswers.push(true) : validateAnswers.push(false);
        console.log("validateAnswers: " + validateAnswers);

        const test02 = await postDataApi('Europe/London', "Asia/Tokyo");
        test02.conversionResult.hour == formData.hoursField && test02.conversionResult.minute == formData.minutesField ? validateAnswers.push(true) : validateAnswers.push(false);

        const test03 = await getDateApi();
        test03.dayOfWeek == formData.selectField ? validateAnswers.push(true) : validateAnswers.push(false);

        let validateAnswerTest04: boolean = false;

        for (let i = 0; i < formData.multipleSelectField.length; i++) {
            const test04 = await postDataApi('Europe/London', formData.multipleSelectField[i]);
            console.log("Test04: " + test04);
            if (test04.conversionResult.hour == 11 && test04.conversionResult.minute == 0) {
                validateAnswerTest04 = true;
            } else {
                validateAnswerTest04 = false;
            }
        }
        validateAnswerTest04 ? validateAnswers.push(true) : validateAnswers.push(false);
        console.log("AnswersData:")
        console.log(validateAnswers)


        const areAllTrue = (validateAnswers: string | any[]) => {
            for (let i = 0; i < validateAnswers.length; i++) {
                if (validateAnswers[i] !== true) {
                    return false;
                }
            }
            return true;
        };
        const result = areAllTrue(validateAnswers);

        if (result) {
            const timeoutId = setTimeout(() => {
                console.log("Success");
                spPostData(formData, true);
                setFormScreen("SuccessScreen");
                setLoadingScreen(false); 
              }, 2000);
          
              return () => clearTimeout(timeoutId);
        } else {
            const timeoutId = setTimeout(() => {
                console.log("Fail");
                spPostData(formData, false);
                setFormScreen("FailScreen");
                setLoadingScreen(false); 
              }, 2000);
          
              return () => clearTimeout(timeoutId);

        }

    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
          setLoadingScreen(false); // After 2 seconds, set loadingScreen to false
        }, 1000);
    
        // Cleanup the timeout if the component is unmounted before the timeout completes
        return () => clearTimeout(timeoutId);
      }, []);

    // Styles for FLuent UI components
    const fieldStyles = mergeStyles({
        marginBottom: '20px',
        marginTop: '5px',
        borderRadius: '10px',
        border: '1px solid #6c84ee',
    });

    const dropdownStyles: Partial<IDropdownStyles> = {
        root: { marginBottom: '20px', marginTop: '5px', borderRadius: '10px',
        border: '1px solid #6c84ee' }
    };
      

    const fieldTimeStyles = mergeStyles({
        marginBottom: '20px',
        width: '180px',
        marginTop: '5px',
        borderRadius: '10px',
        border: '1px solid #6c84ee',
    });

    const fieldTimeMinutesStyles = mergeStyles({
        marginBottom: '20px',
        width: '180px',
        marginLeft: '10px',
        marginTop: '5px',
        borderRadius: '10px',
        border: '1px solid #6c84ee',
    });

    return (
        <>{loadingScreen ? <div style={{margin:'auto', height:'600px', alignItems:'center',  WebkitWritingMode:'vertical-lr'}} ><img src={loader} alt="Loading..." /></div> :
        <>
            {formScreen == "FormScreen" ?
                <div className={styles["form-container"]}>
                    <form className={styles["form-display"]} onSubmit={handleSubmit}>
                        <label>Name</label>
                        <TextField
                            name="nameField"
                            value={formData.nameField}
                            onChange={handleInputChange}
                            styles={{ fieldGroup: fieldStyles }}
                            required
                        />

                        <label>E-mail</label>
                        <TextField
                            name="emailField"
                            value={formData.emailField}
                            onChange={handleInputChange}
                            styles={{ fieldGroup: fieldStyles }}
                            required
                        />

                        <label>Country</label>
                        <TextField
                            name="countryField"
                            value={formData.countryField}
                            onChange={handleInputChange}
                            styles={{ fieldGroup: fieldStyles }}
                            required
                        />

                        <hr />

                        <label>Name a capital city in Europe situated in the GMT+1 timezone:</label>
                        <TextField
                            name="textField"
                            value={formData.textField}
                            onChange={handleInputChange}
                            styles={{ fieldGroup: fieldStyles }}
                            required
                        />

                        <label>What is the equivalent time in Tokyo when it's 11:00 AM in London?</label>
                        <div style={{ display: 'flex' }}>
                            <TextField
                                type="number"
                                placeholder="Select Hour (0 - 23):"
                                value={formData.hoursField}
                                onChange={handleHourChange}
                                min={0}
                                max={23}
                                styles={{ fieldGroup: fieldTimeStyles }}
                                required
                            />

                            <TextField
                                type="number"
                                placeholder="Select Minute (0 - 59):"
                                value={formData.minutesField}
                                onChange={handleMinuteChange}
                                min={0}
                                max={59}
                                styles={{ fieldGroup: fieldTimeMinutesStyles }}
                                required
                            />
                        </div>

                        <label>In 2024, February 29th will be on Thursday. What day of the week will it be in 2028?</label>
                        <Dropdown
                            selectedKey={formData.selectField}
                            onChange={(e, option) => handleInputChange2(e, option ? option.key : '')}
                            options={dropdownOptions}
                            placeholder='Select an option'
                            styles={dropdownStyles}
                            required
                        />

                        <label>Which cities has the same timezone as London? (Select all that apply)</label>
                        <Dropdown
                            selectedKeys={formData.multipleSelectField}
                            onChange={handleMultipleSelectChange}
                            options={dropdownOptionsCountries}
                            multiSelect
                            styles={dropdownStyles}
                            required
                        />

                        <PrimaryButton type="submit" styles={{
                            root: {
                                backgroundColor: '#6c84ee',
                                color: '#fff',
                                border: 'none',
                                padding: '10px 20px',
                                fontSize: '1.2rem',
                                fontWeight: 500,
                                cursor: 'pointer',
                                transition: 'background-color 0.3s ease',
                                marginRight: '20px',
                                borderRadius: '5px',
                            },
                            rootHovered: {
                                backgroundColor: '#3b5ef3',
                            }
                        }}>Submit</PrimaryButton>
                        <DefaultButton styles={{
                            root: {
                                backgroundColor: '#ff6347', // Adjust this color as needed
                                color: '#fff',
                                border: 'none',
                                padding: '10px 20px',
                                fontSize: '1.2rem',
                                fontWeight: 500,
                                cursor: 'pointer',
                                transition: 'background-color 0.3s ease',
                                marginRight: '10px',
                                borderRadius: '5px',
                            },
                            rootHovered: {
                                backgroundColor: '#dc143c', // Adjust this color as needed
                            }
                        }}>Cancel</DefaultButton>
                    </form>
                </div> : <>{formScreen === "SuccessScreen" ? (
                    <ResultScreen isSuccess={true} />
                ) : (
                    <ResultScreen isSuccess={false} />
                )}</>}</>}</>
    );
};

export default FormQuiz;