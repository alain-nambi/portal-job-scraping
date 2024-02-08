import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { formatNumberedList } from '@/utilities/format';

interface Job {
  title: string;
  company: string;
  contractType: string;
  dateAnnonce?: string;
  link: string;
  details: string;
}

interface PdfDocumentProps {
  data: Job[];
}

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 50,
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    textDecoration: 'underline',
  },
  section: {
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    marginBottom: 5,
    textDecoration: 'underline',
  },
  text: {
    fontSize: 14,
    marginBottom: 5,
  },
});

const PdfDocument: React.FC<PdfDocumentProps> = ({ data }) => {
  return (
    <Document>
      {data.map((job, index) => (
        <Page size="A4" style={styles.page} key={index}>
          <Text style={styles.header}>Offre d'emploi</Text>

          {job && (
            <View style={styles.section}>
              <Text style={styles.title}>{job.title}</Text>
              <Text style={styles.text}>{`Entreprise: ${job.company}`}</Text>
              <Text style={styles.text}>{`Type de contrat: ${job.contractType}`}</Text>
              <Text style={styles.text}>{`Date de l'annonce: ${job.dateAnnonce}`}</Text>
              <Text style={styles.text}>{`Lien: ${job.link}`}</Text>
              <Text style={styles.text}>{`Détails: ${formatNumberedList(job.details)}`}</Text>
            </View>
          )}
        </Page>
      ))}
    </Document>
  );
};

export default PdfDocument;
