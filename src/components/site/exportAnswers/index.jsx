import React, { useGlobal } from 'reactn';
import PropTypes from 'prop-types';
import xlsx from 'json-as-xlsx';
import { useTranslation, Trans } from 'gatsby-plugin-react-i18next';
import { getContent } from '../../../lib/answers';
import Button from '../button';

const ExportAnswers = ({ name, pages, answers }) => {
  const [global] = useGlobal();
  const { investigation } = global;
  const { t } = useTranslation();

  const getTable = table => {
    const { rows, rowTitles, colTitles } = table || {};

    const flattenedTable = rows.reduce((currentRow, cells, rowIndex) => {
      const flattenedRow = cells.reduce(
        (flattenedCells, currentCell, cellIndex) => {
          const { id } = currentCell;
          const { data } = answers[id] || {};

          const cell = `${t(colTitles[cellIndex + 1])}: ${
            Array.isArray(data) ? data.join('-') : data
          } `;

          return flattenedCells + cell;
        },
        `${t(rowTitles[rowIndex])} `
      );

      return currentRow + flattenedRow;
    }, '');

    return flattenedTable;
  };

  const getAnswer = question => {
    const { id, answerAccessor, answerPre, answerPost } = question;
    const { data } = answers[id] || {};

    let content = getContent(answerAccessor, t(data), true);

    if (answerPre) {
      content = `${t(answerPre)} ${content}`;
    }

    if (answerPost) {
      content += ` ${t(answerPost)}`;
    }

    if (typeof content === 'string') {
      content = content.replace(/(<([^>]+)>)/gi, '').replace(/\s{2,}/g, ' ');
    }

    return content;
  };

  const getContentRow = questions => {
    const content = {
      name,
      investigation: t(`${investigation}::title`),
      answers: {},
    };

    questions.forEach(parentQuestion => {
      const { number, question, tables } = parentQuestion || {};
      if (tables && tables.length > 0) {
        content.answers[number] = getTable(tables[0]);
      } else {
        content.answers[number] = question.map(getAnswer).join(', ');
      }
    });

    return [content];
  };

  const getQuestionColumns = questions =>
    questions.map(question => ({
      label: t('interface::qa_review.export.columns.question', {
        number: question.number,
      }),
      value: `answers.${question.number}`,
    }));

  const buildXlsx = questions => {
    const meta = [
      {
        label: t('interface::qa_review.export.columns.investigation'),
        value: 'investigation',
      },
      {
        label: t('interface::qa_review.export.columns.student'),
        value: 'name',
      },
    ];

    const worksheet = {
      sheet: t('interface::qa_review.export.worksheet_title'),
      columns: [...meta, ...getQuestionColumns(questions)],
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
      <Trans>interface::actions.download_answers</Trans>
    </Button>
  );
};

ExportAnswers.propTypes = {
  name: PropTypes.string,
  pages: PropTypes.array.isRequired,
  answers: PropTypes.object.isRequired,
};

export default ExportAnswers;
