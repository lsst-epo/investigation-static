import React from 'react';
import PropTypes from 'prop-types';
import xlsx from 'json-as-xlsx';
import { useTranslation } from 'gatsby-plugin-react-i18next';
import Button from '../button';

const ExportAnswers = ({ name, pages, answers }) => {
  const { t } = useTranslation();

  const getAnswer = question => {
    const { id, questionType } = question;
    const answer = answers[id];
    const { content, data } = answer || {};

    return questionType === 'range' ? `${data[0]}-${data[1]}` : content;
  };

  const getContentRow = questions => {
    const content = {
      name,
      answers: {},
    };

    questions.forEach(parentQuestion => {
      const { number, question } = parentQuestion;
      content.answers[number] = question.map(getAnswer).join(', ');
    });

    return [content];
  };

  const getQuestionColumns = questions =>
    questions.map(question => ({
      label: `Question ${question.number}`,
      value: `answers.${question.number}`,
    }));

  const buildXlsx = questions => {
    const nameColumn = { label: 'Student', value: 'name' };

    const worksheet = {
      sheet: 'Answers',
      columns: [nameColumn, ...getQuestionColumns(questions)],
      content: getContentRow(questions),
    };

    return [worksheet];
  };

  const handleDownload = () => {
    const questions = pages
      .filter(page => page.questionsByPage)
      .map(page => page.questionsByPage)
      .flat();

    const data = buildXlsx(questions);

    const settings = {
      fileName: `${name} ${new Date().toLocaleDateString(undefined, {
        dateStyle: 'short',
      })}`,
    };

    xlsx(data, settings);
  };

  return (
    <Button flat secondary swapTheming onClick={handleDownload}>
      Download answers
    </Button>
  );
};

ExportAnswers.propTypes = {
  name: PropTypes.string,
  pages: PropTypes.array.isRequired,
  answers: PropTypes.object.isRequired,
};

export default ExportAnswers;
