import React from 'react';
import { Document, Page, View, Text, StyleSheet, Link } from '@react-pdf/renderer';
import { ResumeData } from '@/@types/resume';

const classicStyles = StyleSheet.create({
  page: { padding: 50, paddingHorizontal: 52, backgroundColor: '#ffffff', fontFamily: 'Helvetica' },
  header: { alignItems: 'center', marginBottom: 0 },
  name: { fontSize: 32, fontFamily: 'Helvetica-Bold', color: '#0a0a0a', letterSpacing: -0.5, textAlign: 'center' },
  specializations: { fontSize: 10, color: '#444444', fontFamily: 'Helvetica', textAlign: 'center', marginTop: 4 },
  contactRow: { fontSize: 9, color: '#666666', fontFamily: 'Helvetica', flexDirection: 'row', justifyContent: 'center', marginTop: 2, flexWrap: 'wrap' },
  contactItem: { color: '#666666', textDecoration: 'none' },
  dot: { marginHorizontal: 4 },
  headerRule: { width: '100%', height: 2, backgroundColor: '#0a0a0a', marginTop: 14, marginBottom: 0 },
  sectionHeader: { marginTop: 16, marginBottom: 10, flexDirection: 'row', alignItems: 'center' },
  sectionTitle: { fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: '#0a0a0a', letterSpacing: 3, textTransform: 'uppercase', marginRight: 12 },
  sectionLine: { flex: 1, height: 0.75, backgroundColor: '#d1d5db' },
  summary: { fontSize: 9.5, color: '#1f1f1f', lineHeight: 1.6, textAlign: 'justify' },
  experienceEntry: { marginBottom: 12 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  role: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#0a0a0a' },
  period: { fontSize: 9, color: '#555555', fontFamily: 'Helvetica' },
  companyLine: { fontSize: 9.5, color: '#333333', marginTop: 2, marginBottom: 6, flexDirection: 'row', alignItems: 'center' },
  companyNormal: { color: '#0a0a0a' },
  eduInstitution: { fontSize: 9.5, color: '#0a0a0a', marginTop: 2 },
  eduDescription: { fontSize: 9, color: '#444444', marginTop: 2 },
  skillsGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  skillGroup: { width: '50%', marginBottom: 8 },
  skillCategory: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#0a0a0a', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 3 },
  skillText: { fontSize: 9, color: '#444444', lineHeight: 1.65 },
  certRow: { flexDirection: 'row', marginBottom: 3 },
  certSquare: { width: 4, height: 4, backgroundColor: '#0a0a0a', marginTop: 3.5, marginRight: 8, flexShrink: 0 },
  certText: { fontSize: 9.5, color: '#1f1f1f', lineHeight: 1.6 },
  projectEntry: { marginBottom: 12 },
  projectName: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#0a0a0a' },
  projectDescription: { fontSize: 9, color: '#444444', marginTop: 5, marginBottom: 6 },
  educationEntry: { marginBottom: 12 },
  bulletRow: { flexDirection: 'row', marginBottom: 2.5, paddingLeft: 4 },
  bulletDot: { fontSize: 9, color: '#999999', marginRight: 7, lineHeight: 1.6 },
  bulletText: { fontSize: 9, color: '#2d2d2d', lineHeight: 1.6, flex: 1 },
});

const modernStyles = StyleSheet.create({
  page: { fontFamily: 'Helvetica', backgroundColor: '#ffffff', paddingHorizontal: 44, paddingTop: 44, paddingBottom: 44 },
  name: { fontSize: 28, fontFamily: 'Helvetica-Bold', color: '#111111' },
  title: { fontSize: 14, fontFamily: 'Helvetica-Bold', color: '#333333', marginTop: 2 },
  contactRow: { fontSize: 9, color: '#555555', flexDirection: 'row', marginTop: 4 },
  rule: { height: 1.5, backgroundColor: '#111111', width: '100%', marginTop: 10 },
  sectionTitleBox: { marginTop: 18, marginBottom: 0 },
  sectionTitle: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#111111', letterSpacing: 1.5, textTransform: 'uppercase' },
  sectionRule: { height: 1, backgroundColor: '#cccccc', width: '100%', marginTop: 4, marginBottom: 10 },
  summary: { fontSize: 9.5, color: '#333333', lineHeight: 1.6, textAlign: 'justify' },
  entry: { marginBottom: 14 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  entryTitle: { fontSize: 10.5, fontFamily: 'Helvetica-Bold', color: '#111111' },
  entryPeriod: { fontSize: 9, color: '#555555' },
  entrySubTitle: { fontSize: 9, color: '#777777', marginTop: 1, marginBottom: 5 },
  entryCompany: { fontSize: 10.5, color: '#111111' },
  entryInstitution: { fontSize: 9, color: '#111111' },
  bulletRow: { flexDirection: 'row', marginBottom: 2.5 },
  bulletChar: { fontSize: 9, color: '#333333', marginRight: 6 },
  bulletText: { fontSize: 9, color: '#333333', lineHeight: 1.6, flex: 1 },
  skillGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  skillItem: { width: '33%', fontSize: 9, color: '#333333', marginBottom: 3 },
  eduEntry: { marginBottom: 12 },
  infoLabel: { fontFamily: 'Helvetica-Bold' }
});

const minimalStyles = StyleSheet.create({
  page: { fontFamily: 'Helvetica', backgroundColor: '#ffffff', paddingHorizontal: 48, paddingTop: 48, paddingBottom: 48 },
  header: { alignItems: 'center' },
  name: { fontSize: 22, fontFamily: 'Helvetica-Bold', color: '#111111', textAlign: 'center' },
  headerRule: { height: 1, backgroundColor: '#111111', width: '100%', marginTop: 6, marginBottom: 6 },
  contactRow: { fontSize: 8.5, color: '#555555', flexDirection: 'row', justifyContent: 'center' },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', marginTop: 18, marginBottom: 8 },
  titleRule: { flex: 1, height: 0.75, backgroundColor: '#999999' },
  sectionTitle: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#333333', letterSpacing: 2, textTransform: 'uppercase', marginHorizontal: 10 },
  profile: { fontSize: 9.5, color: '#333333', lineHeight: 1.65, textAlign: 'center', marginBottom: 4 },
  rowEntry: { flexDirection: 'row', marginBottom: 12 },
  leftCol: { width: 110 },
  rightCol: { flex: 1 },
  date: { fontSize: 8, color: '#777777', lineHeight: 1.5 },
  boldText: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#111111' },
  subText: { fontSize: 9, color: '#555555', marginTop: 1 },
  italicText: { fontSize: 8.5, color: '#777777', fontStyle: 'italic', marginTop: 1 },
  bulletRow: { flexDirection: 'row', marginTop: 3 },
  bulletChar: { fontSize: 8.5, color: '#555', marginRight: 5 },
  bulletText: { fontSize: 8.5, color: '#555555', lineHeight: 1.55, flex: 1 },
  skillGroup: { width: '50%', marginBottom: 8 },
  skillCat: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#333', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 },
  skillRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  skillName: { fontSize: 9, color: '#555' },
  skillRating: { fontSize: 9, color: '#777' },
  detailsRow: { flexDirection: 'row', marginBottom: 2 },
  detailsLabel: { fontSize: 9, color: '#777', width: 110 },
  detailsValue: { fontSize: 9, color: '#333', flex: 1 },
  eduInstitution: { fontSize: 9, color: '#111111' },
  companyText: { fontSize: 9, color: '#111111' }
});

const boldStyles = StyleSheet.create({
  page: { fontFamily: 'Helvetica', backgroundColor: '#ffffff', paddingHorizontal: 52, paddingTop: 48, paddingBottom: 48 },
  name: { fontSize: 38, fontFamily: 'Helvetica-Bold', color: '#0a0a0a', marginBottom: 4 },
  title: { fontSize: 16, fontFamily: 'Helvetica-Bold', color: '#222222', marginBottom: 4 },
  contactRow: { fontSize: 9, color: '#555555', flexDirection: 'row' },
  headerRule: { height: 2, backgroundColor: '#0a0a0a', width: '100%', marginTop: 10 },
  sectionHeader: { marginTop: 18, marginBottom: 2 },
  sectionTitle: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#0a0a0a', textTransform: 'uppercase', letterSpacing: 1 },
  sectionRule: { height: 1.5, backgroundColor: '#0a0a0a', width: '100%', marginTop: 3, marginBottom: 8 },
  summary: { fontSize: 9.5, color: '#333333', lineHeight: 1.6, textAlign: 'justify' },
  entry: { marginBottom: 18 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  entryTitle: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#0a0a0a' },
  entryPeriod: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#0a0a0a' },
  entryLoc: { fontSize: 9, color: '#555555', marginBottom: 6 },
  entryCompany: { fontSize: 11, color: '#0a0a0a' },
  bulletRow: { flexDirection: 'row', marginBottom: 4 },
  bulletChar: { fontSize: 9, color: '#444', marginRight: 7 },
  bulletText: { fontSize: 9, color: '#333', lineHeight: 1.6, flex: 1 },
  skillGroup: { width: '33%', marginBottom: 6 },
  skillCat: { fontSize: 8, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 },
  skillItems: { fontSize: 9, color: '#444', lineHeight: 1.6 },
  eduEntry: { marginBottom: 14 },
  entryInstitution: { fontSize: 9, color: '#0a0a0a' },
  infoLabel: { fontFamily: 'Helvetica-Bold' }
});

export const ResumeClassic = ({ data }: { data: ResumeData }) => (
  <Document title={`Resume - ${data.personalInfo.fullName}`}>
    <Page size="A4" style={classicStyles.page}>
      <View style={classicStyles.header}>
        <Text style={classicStyles.name}>{data.personalInfo.fullName}</Text>
        <Text style={classicStyles.specializations}>{data.personalInfo.specializations.join(' · ')}</Text>
        <View style={classicStyles.contactRow}>
          <Text>{data.personalInfo.email}</Text>
          <Text style={classicStyles.dot}>·</Text>
          <Text>{data.personalInfo.phone}</Text>
          <Text style={classicStyles.dot}>·</Text>
          <Text>{data.personalInfo.location}</Text>
          {data.personalInfo.linkedin && (
            <>
              <Text style={classicStyles.dot}>·</Text>
              <Text>{data.personalInfo.linkedin}</Text>
            </>
          )}
        </View>
        <View style={classicStyles.headerRule} />
      </View>

      {data.summary && (
        <View wrap={false}>
          <View style={classicStyles.sectionHeader}><Text style={classicStyles.sectionTitle}>Summary</Text><View style={classicStyles.sectionLine} /></View>
          <Text style={classicStyles.summary}>{data.summary}</Text>
        </View>
      )}

      {data.workExperience.length > 0 && (
        <View>
          <View wrap={false}>
            <View style={classicStyles.sectionHeader}><Text style={classicStyles.sectionTitle}>Experience</Text><View style={classicStyles.sectionLine} /></View>
            <View style={classicStyles.experienceEntry}>
              <View style={classicStyles.rowBetween}><Text style={classicStyles.role}>{data.workExperience[0].role}</Text><Text style={classicStyles.period}>{data.workExperience[0].period}</Text></View>
              <View style={classicStyles.companyLine}><Text style={classicStyles.companyNormal}>{data.workExperience[0].company}</Text><Text> - </Text><Text>{data.workExperience[0].location}</Text></View>
              {data.workExperience[0].bullets.map((b, i) => (<View key={i} style={classicStyles.bulletRow}><Text style={classicStyles.bulletDot}>·</Text><Text style={classicStyles.bulletText}>{b}</Text></View>))}
            </View>
          </View>
          {data.workExperience.slice(1).map((exp, i) => (
            <View key={i} style={classicStyles.experienceEntry}>
              <View style={classicStyles.rowBetween}><Text style={classicStyles.role}>{exp.role}</Text><Text style={classicStyles.period}>{exp.period}</Text></View>
              <View style={classicStyles.companyLine}><Text style={classicStyles.companyNormal}>{exp.company}</Text><Text> - </Text><Text>{exp.location}</Text></View>
              {exp.bullets.map((b, bi) => (<View key={bi} style={classicStyles.bulletRow}><Text style={classicStyles.bulletDot}>·</Text><Text style={classicStyles.bulletText}>{b}</Text></View>))}
            </View>
          ))}
        </View>
      )}

      {data.education.length > 0 && (
        <View>
          <View wrap={false}>
            <View style={classicStyles.sectionHeader}><Text style={classicStyles.sectionTitle}>Education</Text><View style={classicStyles.sectionLine} /></View>
            <View style={classicStyles.educationEntry}>
              <View style={classicStyles.rowBetween}><Text style={classicStyles.role}>{data.education[0].degree}</Text><Text style={classicStyles.period}>{data.education[0].period}</Text></View>
              <Text style={classicStyles.eduInstitution}>{data.education[0].institution}</Text>
            </View>
          </View>
          {data.education.slice(1).map((edu, i) => (
            <View key={i} style={classicStyles.educationEntry}>
              <View style={classicStyles.rowBetween}><Text style={classicStyles.role}>{edu.degree}</Text><Text style={classicStyles.period}>{edu.period}</Text></View>
              <Text style={classicStyles.eduInstitution}>{edu.institution}</Text>
            </View>
          ))}
        </View>
      )}

      {data.projects && data.projects.length > 0 && (
        <View>
          <View wrap={false}>
            <View style={classicStyles.sectionHeader}><Text style={classicStyles.sectionTitle}>Projects</Text><View style={classicStyles.sectionLine} /></View>
            <View style={classicStyles.projectEntry}>
              <View style={classicStyles.rowBetween}><Text style={classicStyles.role}>{data.projects[0].name}</Text><Text style={classicStyles.period}>{data.projects[0].year}</Text></View>
              {data.projects[0].description && <Text style={classicStyles.projectDescription}>{data.projects[0].description}</Text>}
              {data.projects[0].bullets.map((b, i) => (<View key={i} style={classicStyles.bulletRow}><Text style={classicStyles.bulletDot}>·</Text><Text style={classicStyles.bulletText}>{b}</Text></View>))}
            </View>
          </View>
          {data.projects.slice(1).map((proj, i) => (
            <View key={i} style={classicStyles.projectEntry}>
              <View style={classicStyles.rowBetween}><Text style={classicStyles.role}>{proj.name}</Text><Text style={classicStyles.period}>{proj.year}</Text></View>
              {proj.description && <Text style={classicStyles.projectDescription}>{proj.description}</Text>}
              {proj.bullets.map((b, bi) => (<View key={bi} style={classicStyles.bulletRow}><Text style={classicStyles.bulletDot}>·</Text><Text style={classicStyles.bulletText}>{b}</Text></View>))}
            </View>
          ))}
        </View>
      )}

      {data.skills.length > 0 && (
        <View wrap={false}>
          <View style={classicStyles.sectionHeader}><Text style={classicStyles.sectionTitle}>Skills</Text><View style={classicStyles.sectionLine} /></View>
          <View style={classicStyles.skillsGrid}>
            {data.skills.map((cat, i) => (
              <View key={i} style={classicStyles.skillGroup}><Text style={classicStyles.skillCategory}>{cat.category}</Text><Text style={classicStyles.skillText}>{cat.items.join(', ')}</Text></View>
            ))}
          </View>
        </View>
      )}

      {data.certifications.length > 0 && (
        <View wrap={false}>
          <View style={classicStyles.sectionHeader}><Text style={classicStyles.sectionTitle}>Certifications</Text><View style={classicStyles.sectionLine} /></View>
          {data.certifications.map((cert, i) => (
            <View key={i} style={classicStyles.certRow}><View style={classicStyles.certSquare} /><Text style={classicStyles.certText}>{cert}</Text></View>
          ))}
        </View>
      )}
    </Page>
  </Document>
);

export const ResumeModern = ({ data }: { data: ResumeData }) => (
  <Document title={`Resume - ${data.personalInfo.fullName}`}>
    <Page size="A4" style={modernStyles.page}>
      <View>
        <Text style={modernStyles.name}>{data.personalInfo.fullName}</Text>
        <Text style={modernStyles.title}>{data.personalInfo.specializations[0]}</Text>
        <View style={modernStyles.contactRow}>
          <Text>{data.personalInfo.email}</Text>
          <Text> | </Text>
          <Text>{data.personalInfo.phone}</Text>
          <Text> | </Text>
          <Text>{data.personalInfo.location}</Text>
          {data.personalInfo.linkedin && (
            <>
              <Text> | </Text>
              <Text>{data.personalInfo.linkedin}</Text>
            </>
          )}
        </View>
        <View style={modernStyles.rule} />
      </View>

      {data.summary && (
        <View wrap={false}>
          <View style={modernStyles.sectionTitleBox}>
            <Text style={modernStyles.sectionTitle}>Summary</Text>
            <View style={modernStyles.sectionRule} />
          </View>
          <Text style={modernStyles.summary}>{data.summary}</Text>
        </View>
      )}

      {data.workExperience.length > 0 && (
        <View>
          <View wrap={false}>
            <View style={modernStyles.sectionTitleBox}>
              <Text style={modernStyles.sectionTitle}>Experience</Text>
              <View style={modernStyles.sectionRule} />
            </View>
            <View style={modernStyles.entry}>
              <View style={modernStyles.rowBetween}>
                <Text style={modernStyles.entryCompany}>{data.workExperience[0].company}</Text>
                <Text style={modernStyles.entryPeriod}>{data.workExperience[0].period}</Text>
              </View>
              <Text style={modernStyles.entrySubTitle}>{data.workExperience[0].role}</Text>
              <Text style={modernStyles.entrySubTitle}>{data.workExperience[0].location}</Text>
              {data.workExperience[0].bullets.map((b, i) => (
                <View key={i} style={modernStyles.bulletRow}>
                  <Text style={modernStyles.bulletChar}>•</Text>
                  <Text style={modernStyles.bulletText}>{b}</Text>
                </View>
              ))}
            </View>
          </View>
          {data.workExperience.slice(1).map((exp, i) => (
            <View key={i} style={modernStyles.entry}>
              <View style={modernStyles.rowBetween}>
                <Text style={modernStyles.entryCompany}>{exp.company}</Text>
                <Text style={modernStyles.entryPeriod}>{exp.period}</Text>
              </View>
              <Text style={modernStyles.entrySubTitle}>{exp.role}</Text>
              <Text style={modernStyles.entrySubTitle}>{exp.location}</Text>
              {exp.bullets.map((b, bi) => (
                <View key={bi} style={modernStyles.bulletRow}>
                  <Text style={modernStyles.bulletChar}>•</Text>
                  <Text style={modernStyles.bulletText}>{b}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      )}

      {data.skills.length > 0 && (
        <View wrap={false}>
          <View style={modernStyles.sectionTitleBox}>
            <Text style={modernStyles.sectionTitle}>Skills</Text>
            <View style={modernStyles.sectionRule} />
          </View>
          <View style={modernStyles.skillGrid}>
            {data.skills.flatMap(s => s.items).map((skill, i) => (
              <Text key={i} style={modernStyles.skillItem}>{skill}</Text>
            ))}
          </View>
        </View>
      )}

      {data.education.length > 0 && (
        <View>
          <View wrap={false}>
            <View style={modernStyles.sectionTitleBox}>
              <Text style={modernStyles.sectionTitle}>Education</Text>
              <View style={modernStyles.sectionRule} />
            </View>
            <View style={modernStyles.eduEntry}>
              <View style={modernStyles.rowBetween}>
                <Text style={modernStyles.entryTitle}>{data.education[0].degree}</Text>
                <Text style={modernStyles.entryPeriod}>{data.education[0].period}</Text>
              </View>
              <Text style={modernStyles.entryInstitution}>{data.education[0].institution}</Text>
            </View>
          </View>
          {data.education.slice(1).map((edu, i) => (
            <View key={i} style={modernStyles.eduEntry}>
              <View style={modernStyles.rowBetween}>
                <Text style={modernStyles.entryTitle}>{edu.degree}</Text>
                <Text style={modernStyles.entryPeriod}>{edu.period}</Text>
              </View>
              <Text style={modernStyles.entryInstitution}>{edu.institution}</Text>
            </View>
          ))}
        </View>
      )}

      {(data.projects && data.projects.length > 0) && (
        <View>
          <View style={modernStyles.sectionTitleBox}>
            <Text style={modernStyles.sectionTitle}>Projects</Text>
            <View style={modernStyles.sectionRule} />
          </View>
          {data.projects.map((proj, i) => (
            <View key={i} style={modernStyles.entry}>
              <View style={modernStyles.rowBetween}>
                <Text style={modernStyles.entryTitle}>{proj.name}</Text>
                <Text style={modernStyles.entryPeriod}>{proj.year}</Text>
              </View>
              <Text style={[modernStyles.entrySubTitle, { marginTop: 4 }]}>{proj.description}</Text>
              {proj.bullets.map((b, bi) => (
                <View key={bi} style={modernStyles.bulletRow}>
                  <Text style={modernStyles.bulletChar}>•</Text>
                  <Text style={modernStyles.bulletText}>{b}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      )}

      <View wrap={false}>
        <View style={modernStyles.sectionTitleBox}>
          <Text style={modernStyles.sectionTitle}>Additional Information</Text>
          <View style={modernStyles.sectionRule} />
        </View>
        {data.certifications.length > 0 && (
          <View style={modernStyles.bulletRow}>
            <Text style={modernStyles.bulletChar}>•</Text>
            <Text style={modernStyles.bulletText}><Text style={modernStyles.infoLabel}>Certifications: </Text>{data.certifications.join(", ")}</Text>
          </View>
        )}
        {data.languages && data.languages.length > 0 && (
          <View style={modernStyles.bulletRow}>
            <Text style={modernStyles.bulletChar}>•</Text>
            <Text style={modernStyles.bulletText}><Text style={modernStyles.infoLabel}>Languages: </Text>{data.languages.join(", ")}</Text>
          </View>
        )}
        {data.references && data.references.length > 0 && (
          <View style={modernStyles.bulletRow}>
            <Text style={modernStyles.bulletChar}>•</Text>
            <Text style={modernStyles.bulletText}><Text style={modernStyles.infoLabel}>References: </Text>{data.references.join(", ")}</Text>
          </View>
        )}
      </View>
    </Page>
  </Document>
);

export const ResumeMinimal = ({ data }: { data: ResumeData }) => (
  <Document title={`Resume - ${data.personalInfo.fullName}`}>
    <Page size="A4" style={minimalStyles.page}>
      <View style={minimalStyles.header}>
        <Text style={minimalStyles.name}>{data.personalInfo.fullName}</Text>
        <View style={minimalStyles.headerRule} />
        <View style={minimalStyles.contactRow}>
          <Text>{data.personalInfo.email}</Text>
          <Text> | </Text>
          <Text>{data.personalInfo.phone}</Text>
          <Text> | </Text>
          <Text>{data.personalInfo.location}</Text>
        </View>
      </View>

      {data.summary && (
        <View wrap={false}>
          <View style={minimalStyles.sectionTitleRow}>
            <View style={minimalStyles.titleRule} />
            <Text style={minimalStyles.sectionTitle}>Profile</Text>
            <View style={minimalStyles.titleRule} />
          </View>
          <Text style={minimalStyles.profile}>{data.summary}</Text>
        </View>
      )}

      {data.education.length > 0 && (
        <View>
          <View wrap={false}>
            <View style={minimalStyles.sectionTitleRow}>
              <View style={minimalStyles.titleRule} />
              <Text style={minimalStyles.sectionTitle}>Education</Text>
              <View style={minimalStyles.titleRule} />
            </View>
            <View style={minimalStyles.rowEntry}>
              <View style={minimalStyles.leftCol}>
                <Text style={minimalStyles.date}>{data.education[0].period}</Text>
              </View>
              <View style={minimalStyles.rightCol}>
                <Text style={minimalStyles.boldText}>{data.education[0].degree}</Text>
                <Text style={minimalStyles.eduInstitution}>{data.education[0].institution}</Text>
              </View>
            </View>
          </View>
          {data.education.slice(1).map((edu, i) => (
            <View key={i} style={minimalStyles.rowEntry}>
              <View style={minimalStyles.leftCol}>
                <Text style={minimalStyles.date}>{edu.period}</Text>
              </View>
              <View style={minimalStyles.rightCol}>
                <Text style={minimalStyles.boldText}>{edu.degree}</Text>
                <Text style={minimalStyles.eduInstitution}>{edu.institution}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {data.workExperience.length > 0 && (
        <View>
          <View wrap={false}>
            <View style={minimalStyles.sectionTitleRow}>
              <View style={minimalStyles.titleRule} />
              <Text style={minimalStyles.sectionTitle}>Experience</Text>
              <View style={minimalStyles.titleRule} />
            </View>
            <View style={minimalStyles.rowEntry}>
              <View style={minimalStyles.leftCol}>
                <Text style={minimalStyles.date}>{data.workExperience[0].period}</Text>
              </View>
              <View style={minimalStyles.rightCol}>
                <Text style={minimalStyles.boldText}>{data.workExperience[0].role}</Text>
                <Text style={minimalStyles.companyText}>{data.workExperience[0].company}</Text>
                <Text style={minimalStyles.subText}>{data.workExperience[0].location}</Text>
                {data.workExperience[0].bullets.map((b, i) => (
                  <View key={i} style={minimalStyles.bulletRow}>
                    <Text style={minimalStyles.bulletChar}>•</Text>
                    <Text style={minimalStyles.bulletText}>{b}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
          {data.workExperience.slice(1).map((exp, i) => (
            <View key={i} style={minimalStyles.rowEntry}>
              <View style={minimalStyles.leftCol}>
                <Text style={minimalStyles.date}>{exp.period}</Text>
              </View>
              <View style={minimalStyles.rightCol}>
                <Text style={minimalStyles.boldText}>{exp.role}</Text>
                <Text style={minimalStyles.companyText}>{exp.company}</Text>
                <Text style={minimalStyles.subText}>{exp.location}</Text>
                {exp.bullets.map((b, bi) => (
                  <View key={bi} style={minimalStyles.bulletRow}>
                    <Text style={minimalStyles.bulletChar}>•</Text>
                    <Text style={minimalStyles.bulletText}>{b}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      )}

      {data.skills.length > 0 && (
        <View wrap={false}>
          <View style={minimalStyles.sectionTitleRow}>
            <View style={minimalStyles.titleRule} />
            <Text style={minimalStyles.sectionTitle}>Skills</Text>
            <View style={minimalStyles.titleRule} />
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {data.skills.map((cat, i) => (
              <View key={i} style={minimalStyles.skillGroup}>
                <Text style={minimalStyles.skillCat}>{cat.category}</Text>
                {cat.items.map((skill, si) => (
                  <View key={si} style={minimalStyles.skillRow}>
                    <Text style={minimalStyles.skillName}>{skill}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </View>
      )}

      {data.personalDetails && (
        <View wrap={false}>
          <View style={minimalStyles.sectionTitleRow}>
            <View style={minimalStyles.titleRule} />
            <Text style={minimalStyles.sectionTitle}>Personal Details</Text>
            <View style={minimalStyles.titleRule} />
          </View>
          {data.personalDetails.map((det, i) => (
            <View key={i} style={minimalStyles.detailsRow}>
              <Text style={minimalStyles.detailsLabel}>{det.label}</Text>
              <Text style={minimalStyles.detailsValue}>{det.value}</Text>
            </View>
          ))}
        </View>
      )}

      {(data.projects && data.projects.length > 0) && (
        <View>
          <View style={minimalStyles.sectionTitleRow}>
            <View style={minimalStyles.titleRule} />
            <Text style={minimalStyles.sectionTitle}>Projects</Text>
            <View style={minimalStyles.titleRule} />
          </View>
          {data.projects.map((proj, i) => (
            <View key={i} style={minimalStyles.rowEntry}>
              <View style={minimalStyles.leftCol}>
                <Text style={minimalStyles.date}>{proj.year}</Text>
              </View>
              <View style={minimalStyles.rightCol}>
                <Text style={minimalStyles.boldText}>{proj.name}</Text>
                <Text style={[minimalStyles.subText, { marginTop: 4 }]}>{proj.description}</Text>
                {proj.bullets.map((b, bi) => (
                  <View key={bi} style={minimalStyles.bulletRow}>
                    <Text style={minimalStyles.bulletChar}>•</Text>
                    <Text style={minimalStyles.bulletText}>{b}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      )}
    </Page>
  </Document>
);

export const ResumeBold = ({ data }: { data: ResumeData }) => (
  <Document title={`Resume - ${data.personalInfo.fullName}`}>
    <Page size="A4" style={boldStyles.page}>
      <View>
        <Text style={boldStyles.name}>{data.personalInfo.fullName}</Text>
        <Text style={boldStyles.title}>{data.personalInfo.specializations[0]}</Text>
        <View style={boldStyles.contactRow}>
          <Text>{data.personalInfo.email}</Text>
          <Text> | </Text>
          <Text>{data.personalInfo.phone}</Text>
          <Text> | </Text>
          <Text>{data.personalInfo.location}</Text>
        </View>
        <View style={boldStyles.headerRule} />
      </View>

      {data.summary && (
        <View wrap={false}>
          <View style={boldStyles.sectionHeader}>
            <Text style={boldStyles.sectionTitle}>Summary</Text>
            <View style={boldStyles.sectionRule} />
          </View>
          <Text style={boldStyles.summary}>{data.summary}</Text>
        </View>
      )}

      {data.workExperience.length > 0 && (
        <View>
          <View wrap={false}>
            <View style={boldStyles.sectionHeader}>
              <Text style={boldStyles.sectionTitle}>Experience</Text>
              <View style={boldStyles.sectionRule} />
            </View>
            <View style={boldStyles.entry}>
              <View style={boldStyles.rowBetween}>
                <Text style={boldStyles.entryCompany}>{data.workExperience[0].company}</Text>
                <Text style={boldStyles.entryPeriod}>{data.workExperience[0].period}</Text>
              </View>
              <Text style={boldStyles.entryTitle}>{data.workExperience[0].role}</Text>
              <Text style={boldStyles.entryLoc}>{data.workExperience[0].location}</Text>
              {data.workExperience[0].bullets.map((b, i) => (
                <View key={i} style={boldStyles.bulletRow}>
                  <Text style={boldStyles.bulletChar}>•</Text>
                  <Text style={boldStyles.bulletText}>{b}</Text>
                </View>
              ))}
            </View>
          </View>
          {data.workExperience.slice(1).map((exp, i) => (
            <View key={i} style={boldStyles.entry}>
              <View style={boldStyles.rowBetween}>
                <Text style={boldStyles.entryCompany}>{exp.company}</Text>
                <Text style={boldStyles.entryPeriod}>{exp.period}</Text>
              </View>
              <Text style={boldStyles.entryTitle}>{exp.role}</Text>
              <Text style={boldStyles.entryLoc}>{exp.location}</Text>
              {exp.bullets.map((b, bi) => (
                <View key={bi} style={boldStyles.bulletRow}>
                  <Text style={boldStyles.bulletChar}>•</Text>
                  <Text style={boldStyles.bulletText}>{b}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      )}

      {data.projects && data.projects.length > 0 && (
        <View>
          <View wrap={false}>
            <View style={boldStyles.sectionHeader}>
              <Text style={boldStyles.sectionTitle}>Projects</Text>
              <View style={boldStyles.sectionRule} />
            </View>
            <View style={boldStyles.entry}>
              <View style={[boldStyles.rowBetween, { marginBottom: 4 }]}>
                <Text style={boldStyles.entryTitle}>{data.projects[0].name}</Text>
                <Text style={boldStyles.entryPeriod}>{data.projects[0].year}</Text>
              </View>
              <Text style={[boldStyles.bulletText, { marginBottom: 10 }]}>{data.projects[0].description}</Text>
              {data.projects[0].bullets.map((b, i) => (
                <View key={i} style={[boldStyles.bulletRow, { marginTop: 2 }]}>
                  <Text style={boldStyles.bulletChar}>•</Text>
                  <Text style={boldStyles.bulletText}>{b}</Text>
                </View>
              ))}
            </View>
          </View>
          {data.projects.slice(1).map((proj, i) => (
            <View key={i} style={[boldStyles.entry, { marginTop: 10 }]}>
              <View style={[boldStyles.rowBetween, { marginBottom: 4 }]}>
                <Text style={boldStyles.entryTitle}>{proj.name}</Text>
                <Text style={boldStyles.entryPeriod}>{proj.year}</Text>
              </View>
              <Text style={[boldStyles.bulletText, { marginBottom: 10 }]}>{proj.description}</Text>
              {proj.bullets.map((b, bi) => (
                <View key={bi} style={[boldStyles.bulletRow, { marginTop: 2 }]}>
                  <Text style={boldStyles.bulletChar}>•</Text>
                  <Text style={boldStyles.bulletText}>{b}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      )}

      {data.skills.length > 0 && (
        <View wrap={false}>
          <View style={boldStyles.sectionHeader}>
            <Text style={boldStyles.sectionTitle}>Skills</Text>
            <View style={boldStyles.sectionRule} />
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {data.skills.map((cat, i) => (
              <View key={i} style={boldStyles.skillGroup}>
                <Text style={boldStyles.skillCat}>{cat.category}</Text>
                <Text style={boldStyles.skillItems}>{cat.items.join(", ")}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {data.education.length > 0 && (
        <View>
          <View wrap={false}>
            <View style={boldStyles.sectionHeader}>
              <Text style={boldStyles.sectionTitle}>Education</Text>
              <View style={boldStyles.sectionRule} />
            </View>
            <View style={boldStyles.eduEntry}>
              <View style={boldStyles.rowBetween}>
                <Text style={boldStyles.entryTitle}>{data.education[0].degree}</Text>
                <Text style={boldStyles.entryPeriod}>{data.education[0].period}</Text>
              </View>
              <Text style={boldStyles.entryInstitution}>{data.education[0].institution}</Text>
            </View>
          </View>
          {data.education.slice(1).map((edu, i) => (
            <View key={i} style={boldStyles.eduEntry}>
              <View style={boldStyles.rowBetween}>
                <Text style={boldStyles.entryTitle}>{edu.degree}</Text>
                <Text style={boldStyles.entryPeriod}>{edu.period}</Text>
              </View>
              <Text style={boldStyles.entryInstitution}>{edu.institution}</Text>
            </View>
          ))}
        </View>
      )}

      <View wrap={false}>
        <View style={boldStyles.sectionHeader}>
          <Text style={boldStyles.sectionTitle}>Additional Information</Text>
          <View style={boldStyles.sectionRule} />
        </View>
        {data.languages && data.languages.length > 0 && (
          <View style={boldStyles.bulletRow}>
            <Text style={boldStyles.bulletChar}>•</Text>
            <Text style={boldStyles.bulletText}><Text style={boldStyles.infoLabel}>Languages: </Text>{data.languages.join(", ")}</Text>
          </View>
        )}
        {data.certifications.length > 0 && (
          <View style={boldStyles.bulletRow}>
            <Text style={boldStyles.bulletChar}>•</Text>
            <Text style={boldStyles.bulletText}><Text style={boldStyles.infoLabel}>Certifications: </Text>{data.certifications.join(", ")}</Text>
          </View>
        )}
        {data.references && data.references.length > 0 && (
          <View style={boldStyles.bulletRow}>
            <Text style={boldStyles.bulletChar}>•</Text>
            <Text style={boldStyles.bulletText}><Text style={boldStyles.infoLabel}>Awards: </Text>{data.references.join(", ")}</Text>
          </View>
        )}
      </View>

      {data.references && data.references.length > 0 && (
        <View break>
          <View style={boldStyles.sectionHeader}>
            <Text style={boldStyles.sectionTitle}>References</Text>
            <View style={boldStyles.sectionRule} />
          </View>
          {data.references.map((ref, i) => (
            <View key={i} style={boldStyles.bulletRow}>
              <Text style={boldStyles.bulletChar}>•</Text>
              <Text style={boldStyles.bulletText}>{ref}</Text>
            </View>
          ))}
        </View>
      )}
    </Page>
  </Document>
);
