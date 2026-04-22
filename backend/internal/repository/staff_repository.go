package repository

import (
	"context"
	"fmt"

	"github.com/arganaphang/cycle/backend/graph/model"
	"github.com/arganaphang/cycle/backend/internal/entity"
	"github.com/doug-martin/goqu/v9"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
)

type StaffRepository interface {
	Loader(ctx context.Context, IDs []uuid.UUID) ([]*model.Staff, []error)
	LoaderByUserIDs(ctx context.Context, userIDs []uuid.UUID) ([]*model.Staff, []error)
	FindAll(ctx context.Context, search *string, limit *int32, offset *int32) ([]*entity.Staff, *int32, error)
	FindByID(ctx context.Context, id uuid.UUID) (*entity.Staff, error)
	Create(ctx context.Context, input model.CreateStaffInput) (*entity.Staff, error)
	Update(ctx context.Context, id uuid.UUID, input model.UpdateStaffInput) (*entity.Staff, error)
}

type staffRepository struct {
	db *sqlx.DB
}

func NewStaffRepository(db *sqlx.DB) StaffRepository {
	return &staffRepository{db: db}
}

// Create implements [StaffRepository].
func (s *staffRepository) Create(ctx context.Context, input model.CreateStaffInput) (*entity.Staff, error) {
	stmt := goqu.Insert(entity.TABLE_STAFF).
		Rows(goqu.Record{
			"user_id":        input.UserID,
			"full_name":      input.FullName,
			"specialization": input.Specialization,
			"license_no":     input.LicenseNo,
			"phone":          input.Phone,
		}).
		Returning("*")
	sql, _, _ := stmt.ToSQL()
	staff := entity.Staff{}
	if err := s.db.Get(&staff, sql); err != nil {
		return nil, err
	}
	return &staff, nil
}

// Loader implements [StaffRepository].
func (s *staffRepository) Loader(ctx context.Context, IDs []uuid.UUID) ([]*model.Staff, []error) {
	stmt := goqu.From(entity.TABLE_STAFF)
	sql, _, _ := stmt.Where(goqu.C("id").In(IDs)).ToSQL()
	results := []*entity.Staff{}
	if err := s.db.Select(&results, sql); err != nil {
		return nil, []error{err}
	}
	staffs := []*model.Staff{}
	for idx := range results {
		staffs = append(staffs, results[idx].ToModel())
	}
	return staffs, nil
}

// LoaderByUserID implements [StaffRepository].
func (s *staffRepository) LoaderByUserIDs(ctx context.Context, userIDs []uuid.UUID) ([]*model.Staff, []error) {
	stmt := goqu.From(entity.TABLE_STAFF)
	sql, _, _ := stmt.Where(goqu.C("user_id").In(userIDs)).ToSQL()
	results := []*entity.Staff{}
	if err := s.db.Select(&results, sql); err != nil {
		return nil, []error{err}
	}
	staffs := []*model.Staff{}
	for idx := range results {
		staffs = append(staffs, results[idx].ToModel())
	}
	return staffs, nil
}

// FindAll implements [StaffRepository].
func (s *staffRepository) FindAll(ctx context.Context, search *string, limit *int32, offset *int32) ([]*entity.Staff, *int32, error) {
	limitFilter := uint(20)
	offsetFilter := uint(0)
	if limit != nil {
		limitFilter = uint(*limit)
	}
	if offset != nil {
		offsetFilter = uint(*offset)
	}
	stmt := goqu.From(entity.TABLE_STAFF)

	if search != nil {
		stmt = stmt.Where(goqu.C("full_name").Like(fmt.Sprintf("%s%%", *search)))
	}

	sql, _, _ := stmt.Limit(limitFilter).Offset(offsetFilter).ToSQL()
	staffs := []*entity.Staff{}
	if err := s.db.Select(&staffs, sql); err != nil {
		return nil, nil, err
	}
	sqlCount, _, err := stmt.Select(goqu.COUNT("*")).ToSQL()
	if err != nil {
		return nil, nil, err
	}

	var count int32
	if err := s.db.Get(&count, sqlCount); err != nil {
		return nil, nil, err
	}
	return staffs, &count, nil
}

// FindByID implements [StaffRepository].
func (s *staffRepository) FindByID(ctx context.Context, id uuid.UUID) (*entity.Staff, error) {
	sql, _, _ := goqu.From(entity.TABLE_STAFF).Where(goqu.C("id").Eq(id)).ToSQL()
	staff := entity.Staff{}
	if err := s.db.Get(&staff, sql); err != nil {
		return nil, err
	}
	return &staff, nil
}

// Update implements [StaffRepository].
func (s *staffRepository) Update(ctx context.Context, id uuid.UUID, input model.UpdateStaffInput) (*entity.Staff, error) {
	records := goqu.Record{}
	if input.FullName != nil {
		records["full_name"] = *input.FullName
	}
	if input.Specialization != nil {
		records["specialization"] = *input.Specialization
	}
	if input.LicenseNo != nil {
		records["license_no"] = *input.LicenseNo
	}
	if input.Phone != nil {
		records["phone"] = *input.Phone
	}
	sql, _, err := goqu.Update(entity.TABLE_STAFF).
		Set(records).
		Where(goqu.C("id").Eq(id)).
		Returning("*").
		ToSQL()
	if err != nil {
		return nil, err
	}
	staff := entity.Staff{}
	if err := s.db.Get(&staff, sql); err != nil {
		return nil, err
	}
	return &staff, nil
}
