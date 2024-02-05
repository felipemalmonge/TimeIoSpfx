import * as React from 'react';
import styles from './ResultScreen.module.scss';
import complete from '../assets/Checklist.jpg';
import failed from '../assets/Decrease_3.jpg';

interface ResultScreenProps {
    isSuccess: boolean;
    //answersQuiz: boolean[];
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ isSuccess }) => {

    return (
        <div className={styles.resultContainer}>
            <>
            {isSuccess ?
                <div className={styles.details}>
                    <img src={complete} alt="complete" />
                    <p className={styles.success}>Congratulations! You've provided all the correct answers. Great job!</p>
                </div>
                : <div className={styles.details}>
                    <img src={failed} alt="failed" />
                    <p className={styles.failed}>I'm sorry, but one or more of your answers are incorrect. Don't worry, your next attempt will be better!</p>
                </div>}
            </>
        </div>
    );
};
