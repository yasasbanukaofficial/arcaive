import React from 'react';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { ResumeData } from '@/@types/resume';

const styles = StyleSheet.create({
  page: {
    paddingTop: 50,
    paddingBottom: 50,
    paddingHorizontal: 52,
    backgroundColor: '#ffffff', // TODO: replace with your data
    fontFamily: 'Helvetica',
  },
  header: {
    alignItems: 'center',
    marginBottom: 0,
  },
  name: {
    fontSize: 32,
    fontFamily: 'Helvetica-Bold',
    color: '#0a0a0a', // TODO: replace with your data
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  specializations: {
    fontSize: 10,
    color: '#444444', // TODO: replace with your data
    fontFamily: 'Helvetica',
    textAlign: 'center',
    marginTop: 4,
  },
  contactRow: {
    fontSize: 9,
    color: '#666666', // TODO: replace with your data
    fontFamily: 'Helvetica',
    textAlign: 'center',
    marginTop: 2,
  },
  headerRule: {
    width: '100%',
    height: 2,
    backgroundColor: '#0a0a0a', // TODO: replace with your data
    marginTop: 14,
    marginBottom: 0,
  },
  sectionHeader: {
    marginTop: 22,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: '#0a0a0a', // TODO: replace with your data
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginRight: 12,
  },
  sectionLine: {
    flex: 1,
    height: 0.75,
    backgroundColor: '#d1d5db', // TODO: replace with your data
  },
  summary: {
    fontSize: 9.5,
    color: '#1f1f1f', // TODO: replace with your data
    lineHeight: 1.75,
    textAlign: 'justify',
  },
  experienceEntry: {
    marginBottom: 16,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  role: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#0a0a0a', // TODO: replace with your data
  },
  period: {
    fontSize: 9,
    color: '#555555', // TODO: replace with your data
    fontFamily: 'Helvetica',
  },
  companyLine: {
    fontSize: 9.5,
    color: '#333333', // TODO: replace with your data
    marginTop: 2,
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  companyBold: {
    fontFamily: 'Helvetica-Bold',
    color: '#0a0a0a', // TODO: replace with your data
  },
  locationRegular: {
    fontFamily: 'Helvetica',
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 3.5,
    paddingLeft: 4,
  },
  bulletDot: {
    fontSize: 9,
    color: '#999999', // TODO: replace with your data
    marginRight: 7,
    lineHeight: 1.6,
  },
  bulletText: {
    fontSize: 9,
    color: '#2d2d2d', // TODO: replace with your data
    lineHeight: 1.6,
    flex: 1,
  },
  educationEntry: {
    marginBottom: 14,
  },
  eduInstitution: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: '#0a0a0a', // TODO: replace with your data
    marginTop: 2,
  },
  eduDescription: {
    fontSize: 9,
    color: '#444444', // TODO: replace with your data
    marginTop: 2,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillGroup: {
    width: '50%',
    marginBottom: 10,
  },
  skillCategory: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#0a0a0a', // TODO: replace with your data
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  skillText: {
    fontSize: 9,
    color: '#444444', // TODO: replace with your data
    lineHeight: 1.65,
  },
  certRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  certSquare: {
    width: 4,
    height: 4,
    backgroundColor: '#0a0a0a', // TODO: replace with your data
    marginTop: 3.5,
    marginRight: 8,
    flexShrink: 0,
  },
  certText: {
    fontSize: 9.5,
    color: '#1f1f1f', // TODO: replace with your data
    lineHeight: 1.6,
  },
});

interface ResumeDocumentProps {
  data: ResumeData;
}

export const ResumeDocument: React.FC<ResumeDocumentProps> = ({ data }) => (
  <Document title={`Resume - ${data.personalInfo.fullName}`}>
    <Page size="A4" style={styles.page}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.name}>{data.personalInfo.fullName /* TODO: replace with your data */}</Text>
        <Text style={styles.specializations}>
          {data.personalInfo.specializations.join(' · ') /* TODO: replace with your data */}
        </Text>
        <Text style={styles.contactRow}>
          {[
            data.personalInfo.location,
            data.personalInfo.email,
            data.personalInfo.phone,
            data.personalInfo.linkedin
          ].filter(Boolean).join(' · ') /* TODO: replace with your data */}
        </Text>
        <View style={styles.headerRule} />
      </View>

      {/* PROFESSIONAL SUMMARY */}
      {data.summary && (
        <View>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Summary {/* TODO: replace with your data */}</Text>
            <View style={styles.sectionLine} />
          </View>
          <Text style={styles.summary}>{data.summary /* TODO: replace with your data */}</Text>
        </View>
      )}

      {/* WORK EXPERIENCE */}
      {data.workExperience.length > 0 && (
        <View>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Experience {/* TODO: replace with your data */}</Text>
            <View style={styles.sectionLine} />
          </View>
          {data.workExperience.map((exp, index) => (
            <View key={index} style={styles.experienceEntry}>
              <View style={styles.rowBetween}>
                <Text style={styles.role}>{exp.role /* TODO: replace with your data */}</Text>
                <Text style={styles.period}>{exp.period /* TODO: replace with your data */}</Text>
              </View>
              <View style={styles.companyLine}>
                <Text style={styles.companyBold}>{exp.company /* TODO: replace with your data */}</Text>
                <Text> · {/* TODO: replace with your data */}</Text>
                <Text style={styles.locationRegular}>{exp.location /* TODO: replace with your data */}</Text>
              </View>
              {exp.bullets.map((bullet, bIndex) => (
                <View key={bIndex} style={styles.bulletRow}>
                  <Text style={styles.bulletDot}>·</Text>
                  <Text style={styles.bulletText}>{bullet /* TODO: replace with your data */}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      )}

      {/* EDUCATION */}
      {data.education.length > 0 && (
        <View>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Education {/* TODO: replace with your data */}</Text>
            <View style={styles.sectionLine} />
          </View>
          {data.education.map((edu, index) => (
            <View key={index} style={styles.educationEntry}>
              <View style={styles.rowBetween}>
                <Text style={styles.role}>{edu.degree /* TODO: replace with your data */}</Text>
                <Text style={styles.period}>{edu.period /* TODO: replace with your data */}</Text>
              </View>
              <Text style={styles.eduInstitution}>{edu.institution /* TODO: replace with your data */}</Text>
              {edu.location && <Text style={styles.eduDescription}>{edu.location /* TODO: replace with your data */}</Text>}
            </View>
          ))}
        </View>
      )}

      {/* TECHNICAL SKILLS */}
      {data.skills.length > 0 && (
        <View>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Skills {/* TODO: replace with your data */}</Text>
            <View style={styles.sectionLine} />
          </View>
          <View style={styles.skillsGrid}>
            {data.skills.map((cat, index) => (
              <View key={index} style={styles.skillGroup}>
                <Text style={styles.skillCategory}>{cat.category /* TODO: replace with your data */}</Text>
                <Text style={styles.skillText}>{cat.items.join(', ') /* TODO: replace with your data */}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* CERTIFICATIONS */}
      {data.certifications.length > 0 && (
        <View>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Certifications {/* TODO: replace with your data */}</Text>
            <View style={styles.sectionLine} />
          </View>
          {data.certifications.map((cert, index) => (
            <View key={index} style={styles.certRow}>
              <View style={styles.certSquare} />
              <Text style={styles.certText}>{cert /* TODO: replace with your data */}</Text>
            </View>
          ))}
        </View>
      )}
    </Page>
  </Document>
);
