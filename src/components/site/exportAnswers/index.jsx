import React from 'react';
import PropTypes from 'prop-types';
import { json2csv } from 'json-2-csv';
import { useTranslation } from 'gatsby-plugin-react-i18next';
import { downloadFile } from '../../../lib/utilities';
import Button from '../button';

const ExportAnswers = ({ name, pages, answers }) => {
  const { t } = useTranslation();

  const getAnswer = question => {
    const { id, questionType } = question;
    const answer = answers[id];
    const { content, data } = answer || {};

    return questionType === 'range' ? `${data[0]}-${data[1]}` : content;
  };

  const parseCSV = () => {
    const csvData = [{ Name: name, 'Question Number': ' ', Answer: ' ' }];
    pages
      .filter(page => page.questionsByPage)
      .forEach(page => {
        const { questionsByPage: questions } = page;

        const rows = questions.map(question => {
          const { question: q, number } = question;
          const Answer = q.map(getAnswer).join(', ');

          return {
            Name: ' ',
            'Question Number': +number,
            Answer,
          };
        });

        csvData.push(...rows);
      });

    return csvData;
  };

  const downloadCSV = (err, csv) => {
    if (err) throw err;

    const filename = `${name} ${new Date().toLocaleDateString(undefined, {
      dateStyle: 'short',
    })}.csv`;
    downloadFile(csv, filename, 'text/csv');
  };

  const handleDownload = () => {
    const data = parseCSV();

    json2csv(data, downloadCSV, {
      emptyFieldValue: t('errors.qas.answer_not_provided'),
    });
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
