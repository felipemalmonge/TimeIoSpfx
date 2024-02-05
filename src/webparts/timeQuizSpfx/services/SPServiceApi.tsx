import axios from 'axios';
import { WebPartContext } from '@microsoft/sp-webpart-base';

const spPostData = async ( formData: any, resultQuiz: boolean, context?: WebPartContext) => {
    console.log('Form data:', formData);
    const spListData = {
        "__metadata": { "type": "SP.Data.TimeQuizAnswersListItem" },
        Title: "Test",
        UserName: formData.textField, // Assuming textField is the username
        UserEmail: formData.emailField,
        Country: formData.countryField,
        QuizResultSuccess: resultQuiz, // Assuming true for success
        AnswerQuiz01: formData.textField,
        AnswerQuiz02: formData.selectField,
        AnswerQuiz03: `${formData.hoursField}:${formData.minutesField}`,
        AnswerQuiz04: formData.multipleSelectField.join(', '), // Assuming multipleSelectField is an array
    };

    // Get the SharePoint list URL using the provided context
    const spListUrl = `${context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('TimeQuizAnswers')/items`;
    console.log('SP list URL:', spListUrl);

    try {
        const requestDigest = await getRequestDigest();

        const response = await axios.post(spListUrl, spListData, {
            headers: {
                'Accept': 'application/json;odata=verbose',
                'Content-Type': 'application/json;odata=verbose',
                'X-RequestDigest': requestDigest,
            },
        });

        console.log('Item added to SharePoint list:', response.data);
    } catch (error) {
        console.error('Error adding item to SharePoint list:', error);
    }
}

const getRequestDigest = async () => {
    const digestUrl = "https://schuellermoebel.sharepoint.com/sites/Intranet_DEV/_api/contextinfo";
    
    try {
        const response = await axios.post(digestUrl, {}, {
            headers: {
                'Accept': 'application/json;odata=verbose',
                'Content-Type': 'application/json;odata=verbose',
            },
        });
        
        const requestDigest = response.data.d.GetContextWebInformation.FormDigestValue;
        console.log('Request digest:', requestDigest);
        return requestDigest;
    } catch (error) {
        console.error('Error obtaining request digest:', error);
        throw error;
    }
};

export default spPostData;