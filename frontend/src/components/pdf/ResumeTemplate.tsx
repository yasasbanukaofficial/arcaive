import React from 'react';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { ResumeData } from '@/@types/resume';

const styles = StyleSheet.create({
  page: {
    paddingTop: 48,
    paddingBottom: 40,
    paddingHorizontal: 48,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 28,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  specializations: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#374151',
    marginBottom: 4,
  },
  contactRow: {
    fontSize: 9,
    color: '#64748b',
  },
  headerRule: {
    width: '100%',
    height: 1.5,
    backgroundColor: '#0f172a',
    marginTop: 10,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  sectionRule: {
    height: 1.5,
    backgroundColor: '#0f172a',
    width: '100%',
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 9.5,
    color: '#374151',
    lineHeight: 1.7,
    textAlign: 'justify',
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  role: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
  },
  period: {
    fontSize: 9.5,
    color: '#374151',
  },
  companyLine: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: '#2563eb',
    marginBottom: 5,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  bulletDot: {
    fontSize: 9,
    color: '#9ca3af',
    marginRight: 6,
  },
  bulletText: {
    fontSize: 9,
    color: '#374151',
    lineHeight: 1.6,
    flex: 1,
  },
  experienceEntry: {
    marginBottom: 14,
  },
  educationEntry: {
    marginBottom: 10,
  },
  skillsRow: {
    flexDirection: 'row',
  },
  skillsColumn: {
    flex: 1,
  },
  skillCategory: {
    marginBottom: 10,
  },
  categoryLabel: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    marginBottom: 2,
  },
  skillItems: {
    fontSize: 9,
    color: '#374151',
    lineHeight: 1.6,
  },
  certificationText: {
    fontSize: 9.5,
    color: '#374151',
    lineHeight: 1.6,
  }
});

interface ResumeDocumentProps {
  data: ResumeData;
}

export const ResumeDocument: React.FC<ResumeDocumentProps> = ({ data }) => (
  <Document title={`Resume - ${data.personalInfo.fullName}`}>
    <Page size="A4" style={styles.page}>
      {/* HEADER BLOCK */}
      <View style={styles.header}>
        <Text style={styles.name}>{data.personalInfo.fullName}</Text>
        <Text style={styles.specializations}>
          {data.personalInfo.specializations.join(' | ')}
        </Text>
        <Text style={styles.contactRow}>
          {[
            data.personalInfo.location,
            data.personalInfo.email,
            data.personalInfo.phone,
            data.personalInfo.linkedin
          ].filter(Boolean).join(' | ')}
        </Text>
        <View style={styles.headerRule} />
      </View>

      {/* 1. PROFESSIONAL SUMMARY */}
      {data.summary && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Summary</Text>
          <View style={styles.sectionRule} />
          <Text style={styles.summaryText}>{data.summary}</Text>
        </View>
      )}

      {/* 2. WORK EXPERIENCE */}
      {data.workExperience.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Experience</Text>
          <View style={styles.sectionRule} />
          {data.workExperience.map((exp, index) => (
            <View key={index} style={styles.experienceEntry}>
              <View style={styles.entryHeader}>
                <Text style={styles.role}>{exp.role}</Text>
                <Text style={styles.period}>{exp.period}</Text>
              </View>
              <Text style={styles.companyLine}>{exp.company} | {exp.location}</Text>
              {exp.bullets.map((bullet, bIndex) => (
                <View key={bIndex} style={styles.bulletRow}>
                  <Text style={styles.bulletDot}>·</Text>
                  <Text style={styles.bulletText}>{bullet}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      )}

      {/* 3. EDUCATION */}
      {data.education.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          <View style={styles.sectionRule} />
          {data.education.map((edu, index) => (
            <View key={index} style={styles.educationEntry}>
              <View style={styles.entryHeader}>
                <Text style={styles.role}>{edu.degree}</Text>
                <Text style={styles.period}>{edu.period}</Text>
              </View>
              <Text style={styles.companyLine}>{edu.institution} | {edu.location}</Text>
            </View>
          ))}
        </View>
      )}

      {/* 4. SKILLS */}
      {data.skills.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Technical Skills</Text>
          <View style={styles.sectionRule} />
          <View style={styles.skillsRow}>
            {/* Split skills into two columns if more than 2 categories */}
            <View style={styles.skillsColumn}>
              {data.skills.filter((_, i) => i % 2 === 0).map((cat, index) => (
                <View key={index} style={styles.skillCategory}>
                  <Text style={styles.categoryLabel}>{cat.category}</Text>
                  <Text style={styles.skillItems}>{cat.items.join(', ')}</Text>
                </View>
              ))}
            </View>
            <View style={styles.skillsColumn}>
              {data.skills.filter((_, i) => i % 2 !== 0).map((cat, index) => (
                <View key={index} style={styles.skillCategory}>
                  <Text style={styles.categoryLabel}>{cat.category}</Text>
                  <Text style={styles.skillItems}>{cat.items.join(', ')}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* 5. CERTIFICATIONS */}
      {data.certifications.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Certifications</Text>
          <View style={styles.sectionRule} />
          {data.certifications.map((cert, index) => (
            <View key={index} style={styles.bulletRow}>
              <Text style={styles.bulletDot}>·</Text>
              <Text style={styles.certificationText}>{cert}</Text>
            </View>
          ))}
        </View>
      )}
    </Page>
  </Document>
);

