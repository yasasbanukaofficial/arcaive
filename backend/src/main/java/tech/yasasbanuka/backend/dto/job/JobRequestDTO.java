package tech.yasasbanuka.backend.dto.job;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class JobRequestDTO {
    private String id;
    private String title;
    private String company;
    private String companyLogo;
    private String companyWebsite;
    private String publisher;
    private String employmentType;
    private List<String> employmentTypes;
    private String applyLink;
    private boolean applyIsDirect;
    private List<ApplyOptionDTO> applyOptions;
    private String description;
    private boolean isRemote;
    private String postedAt;
    private long postedAtTimestamp;
    private String postedAtDatetime;
    private String location;
    private String city;
    private String state;
    private String country;
    private String salary;
    private Double minSalary;
    private Double maxSalary;
    private String salaryPeriod;
    private Map<String, List<String>> highlights;
    private List<String> benefits;
    private String googleLink;
}